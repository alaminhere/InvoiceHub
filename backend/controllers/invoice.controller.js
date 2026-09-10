const mongoose = require('mongoose');

const Customer = require('../models/customerModel');
const Store = require('../models/storeModel');
const Invoice = require('../models/invoiceModel');

const {
  invoicePipeline,
  SingleInvoicePipeline,
} = require('../pipelines/invoicePipeline');
const sendResponse = require('../libs/sendResponse');

const generateInvoiceHTML = require('../libs/invoiceTemplate');

/**
 *
 *
 *
 * get all invoices
 * get invoice by id
 * update invoice by id
 * delete invoice by id
 * create invoice
 * download invoice
 *
 *
 *
 */

/*----------------------------------------*
 *                                        *
 *  GET ALL INVOICES                      *
 *                                        *
 * ----------------------------------------*/

const getAllInvoices = async (req, res) => {
  const storeId = new mongoose.Types.ObjectId(res.locals.storeId);
  const search = req.query.search?.trim() || '';
  const status = req.query.status?.trim() || 'all';
  const limit = req.query.limit;
  try {
    // invoice pipeline query
    const pipeline = invoicePipeline({ storeId, search, status, limit });
    const invoice = await Invoice.aggregate(pipeline);

    if (invoice.length == 0) {
      return sendResponse(res, 404, false, 'Invoice not Found');
    }

    return sendResponse(res, 200, true, 'ok', { invoice });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  GET INVOICE BY ID                      *
 *                                         *
 * ----------------------------------------*/

const getInvoicesById = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);

  try {
    // invoice pipeline query
    const pipeline = SingleInvoicePipeline({ id });
    const [invoice] = await Invoice.aggregate(pipeline);

    if (!invoice) {
      return sendResponse(res, 404, false, 'Invoice not Found');
    }

    sendResponse(res, 200, true, 'ok', { invoice });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  CREATE INVOICE                         *
 *                                         *
 * ----------------------------------------*/

const createInvoice = async (req, res) => {
  const storeId = res.locals.storeId;
  const customerId = req.body.customer;

  try {
    // customer find query
    const customer = await Customer.findOne({
      _id: customerId,
      store: storeId,
    });
    if (!customer) {
      return sendResponse(res, 404, false, 'Customer not found');
    }

    // store find query
    const store = await Store.findById(storeId);
    // Store invoicePrefix example INV- , and invoiceNumber example 100
    // invoiceNo INV-100
    const invoiceNo = `${store.invoicePrefix}${store.nextInvoiceNumber}`;

    req.body.store = storeId;
    req.body.invoiceNo = invoiceNo;
    // store dueDate default 30 days from now
    req.body.dueDate = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * store.defaultDuePeriod,
    );
    // create invoice
    const newInvoice = await Invoice.create(req.body);

    // update store nextInvoiceNumber and save
    store.nextInvoiceNumber += 1;
    await store.save();

    sendResponse(res, 201, true, 'Invoice Create Successfully', { newInvoice });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  UPDATE INVOICE BY ID                   *
 *                                         *
 * ----------------------------------------*/

const updateInvoiceById = async (req, res) => {
  const id = req.params.id;
  try {
    const invoice = await Invoice.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!invoice) {
      return sendResponse(res, 404, false, 'Invoice not Found!');
    }

    sendResponse(res, 201, true, 'Invoice Update Successfully', { invoice });
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  DELETE INVOICE BY ID                   *
 *                                         *
 * ----------------------------------------*/

const deleteInvoiceById = async (req, res) => {
  const id = req.params.id;
  try {
    // invoice find query
    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return sendResponse(res, 404, false, 'Invoice not Found!');
    }

    sendResponse(res, 200, true, 'Invoice Deleted Successfully');
  } catch (err) {
    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

/*-----------------------------------------*
 *                                         *
 *  DOWNLOAD INVOICE                       *
 *                                         *
 * ----------------------------------------*/

/*-----------------------------------------*
 *                                         *
 *  DOWNLOAD INVOICE                       *
 *                                         *
 * ----------------------------------------*/

const invoiceDownload = async (req, res) => {
  const generateInvoiceHTML = require('../libs/invoiceTemplate');

  const isProd = process.env.NODE_ENV === 'production';

  const chromium = isProd ? require('@sparticuz/chromium') : null;

  let browser = null;

  try {
    const invoice = req.body;
    const html = generateInvoiceHTML(invoice);

    const puppeteer = isProd
      ? (await import('puppeteer-core')).default
      : (await import('puppeteer')).default;

    browser = isProd
      ? await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        })
      : await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: 'networkidle0',
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    browser = null;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${invoice.invoiceNo}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    if (browser) {
      await browser.close();
    }

    return sendResponse(
      res,
      500,
      false,
      err.message || 'Something went wrong!!',
    );
  }
};

module.exports = {
  getAllInvoices,
  getInvoicesById,
  createInvoice,
  updateInvoiceById,
  deleteInvoiceById,
  invoiceDownload,
};

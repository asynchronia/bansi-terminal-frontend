import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, pdf, Image } from '@react-pdf/renderer';
import { formatDate } from '../../utility/formatDate';
import { Button } from 'reactstrap';
import { formatCamelCase, formatNumberWithCommasAndDecimal, indianNumberWords } from './invoiceUtil';


// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  section: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "flex-start",
    gap: 4,
  },
  addressSection: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "flex-start",
    gap: 12
  },
  address: {
    width: '49%'
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: 'auto',
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  firstCol: {
    width: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  tableCell: {
    fontSize: 10,
    textAlign: 'center',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4
  },
  info: {
    fontSize: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 10,
  },
  logoImage: {
    height: 80,
    width: 120,
  },
  amtCard: {
    width: '40%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 3,
    backgroundColor: '#58db83',
    borderRadius: '10px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  amtText: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold'
  }
});

// Function to display table with pagination
const TableWithPagination = ({ data }) => {
  return (
    <View>
      {/* Table Header */}
      <View style={styles.tableRow} fixed>
        <View style={styles.firstCol}>
          <Text style={styles.tableCell}>#</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Invoice No.</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Invoice Date</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Invoice Amount</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Payment Amount</Text>
        </View>
      </View>

      {/* Table Rows */}
      {data.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <View style={styles.firstCol}>
            <Text style={styles.tableCell}>{index + 1}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.invoice_number}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.date}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.total}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.total}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Define the PDF document structure
const PdfDocument = ({data}) => {
  let totalInvoicesAmount = 0;
  let totalBalanceAmount = 0;
  for (const invoice of data.paymentData.invoices) {
    totalInvoicesAmount += invoice?.total || 0;
    totalBalanceAmount += invoice?.balance || 0;
  }
  const amountReceived = totalInvoicesAmount - totalBalanceAmount;
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View  style={[styles.address, { width: '25% !important'}]}>
          <Image src={require("../../assets/images/Willsmeet-Logo.png")} style={styles.logoImage} />
        </View>
        <View style={[styles.address, { width: '40% !important'}]}>
          <Text style={styles.header}>Bansi Office Solutions Private Limited</Text>
          <Text style={styles.info}>#1496, 19th Main Road, Opp Park Square Apartment, HSR Layout, Bangalore Karnataka 560102, India</Text>
          <Text style={styles.info}>Web: www.willsmeet.com, Email:sales@willsmeet.com</Text>
        </View>
      </View>

      <View>
        <Text style={[styles.title, {textAlign: 'center'}]}>PAYMENT RECEIPT</Text>
      </View>

      <View style={[styles.section, { paddingVertical: 10}]}>
        <View style={{width: '60% !important'}}>
            <Text style={[styles.info, { borderBottom: '1px solid #000', paddingVertical: 4}]}>Payment Date: {formatDate(data.paymentData?.date)}</Text>
            <Text style={[styles.info, { borderBottom: '1px solid #000', paddingVertical: 4}]}>Reference Number: {data.paymentData?.reference_number}</Text>
            <Text style={[styles.info, { borderBottom: '1px solid #000', paddingVertical: 4}]}>Payment Mode: {data.paymentData?.payment_mode}</Text>
            <Text style={[styles.info, { paddingTop: 4}]}>Amount Received In Words: {indianNumberWords(amountReceived)}</Text>
        </View>
        <View style={styles.amtCard}>
            <Text style={styles.amtText}>Amount Received:</Text>
            <Text>{parseFloat(amountReceived).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.addressSection}>
        <View style={styles.address}>
          <Text style={styles.header}>Bill To:</Text>
          <Text style={styles.info}>{data.paymentData.customer_name},</Text>
          {/* <Text style={styles.info}>{data.responseObj.billing_address?.address},</Text>
          <Text style={styles.info}>{data.responseObj.billing_address?.city} - {data.responseObj.billing_address?.zip}, {data.responseObj.billing_address?.state}</Text>
          <Text style={styles.info}>{data.responseObj.billing_address?.phone}</Text> */}
        </View>
      </View>

      <View style={styles.table}>
        <Text style={styles.header}>Payment For</Text>
       
        <TableWithPagination data={[...data.paymentData.invoices]} />

      </View>
    </Page>
  </Document>
)};

const PaymentPdfComponent = ({data}) => {
  const handleOpenPdf = async () => {
    const blob = await pdf(<PdfDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  console.log(data)
  return (
    <div>
      {/* <PDFDownloadLink document={<PdfDocument data={data} />} fileName={`${data.purchaseOrderNumber}.pdf`}>
        {({ blob, url, loading, error }) =>
          <Button color="primary" outline onClick={handleOpenPdf}>{loading ? 'Loading...' : 'Download PDF'}</Button>
        }
      </PDFDownloadLink> */}
      <Button color="primary" outline onClick={handleOpenPdf}>Download PDF</Button>
    </div>
  );
};

export default PaymentPdfComponent;

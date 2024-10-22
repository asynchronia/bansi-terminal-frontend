import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { formatDate } from '../../utility/formatDate';
import { formatNumberWithCommasAndDecimal } from '../Invoices/invoiceUtil';
import { Button } from 'reactstrap';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "flex-start",
    gap: 4,
  },
  bold: {
    fontWeight: 'bold'
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
    marginBottom: 10,
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
  descCol: {
    width: 200,
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
  terms: {
    width: '65%',
    padding: 5,
  },
  total: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  note: {
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 10,
  },
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
        <View style={styles.descCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Description
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Unit</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            HSN/SAC
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Qty</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Rate</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Tax %</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Amount
          </Text>
        </View>
      </View>

      {/* Table Rows */}
      {data.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <View style={styles.firstCol}>
            <Text style={styles.tableCell}>{index + 1}</Text>
          </View>
          <View style={styles.descCol}>
            <Text
              style={[
                styles.tableCell,
                { textAlign: 'left', whiteSpace: 'pre-wrap', overflowWrap: 'break-word' },
              ]}
            >
              {item.itemDescription}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.unitPrice}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.hsnCode}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.quantity}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.unitPrice}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.taxes[0].taxPercentage}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.unitPrice * item.quantity}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Define the PDF document structure
const PdfDocument = ({data}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <View style={styles.address}>
            <Text style={styles.header}>{data.orderInfo.clientName}</Text>
            <Text style={styles.info}>{data.orderInfo.billing?.branchName}</Text>
            <Text style={styles.info}>{data.orderInfo.billing?.address}</Text>
            <Text style={styles.info}>{data.orderInfo.billing?.contact}</Text>
        </View>
        <View  style={styles.address}>
            <Text style={[styles.title, {textAlign: 'right'}]}>PURCHASE ORDER</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View>
        <View style={styles.section}>
            <Text style={[styles.address, styles.info]}>Purchase Order: {data.orderInfo.purchaseOrderNumber}</Text>
            <Text style={[styles.address, styles.info]}>Date: {formatDate(data.orderInfo.createdAt)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.address, styles.info]}>Client GST No.: {data.orderInfo.clientGst}</Text>
          <Text style={[styles.address, styles.info]}>Payment Terms: {data.paymentTerms}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View style={styles.addressSection}>
        <View style={styles.address}>
          <Text style={styles.header}>Vendor Address:</Text>
          <Text style={styles.info}>Bansi Office Solutions Private Limited</Text>
          <Text style={styles.info}> #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout, Bangalore Karnataka 560102, India</Text>
          <Text style={styles.info}>Web: www.willsmeet.com, Email:sales@willsmeet.com</Text>
        </View>
        <View style={styles.address}>
          <Text style={styles.header}>Deliver To:</Text>
          <Text style={styles.info}>{data.orderInfo.shipping?.branchName}</Text>
          <Text style={styles.info}>{data.orderInfo.shipping?.address}</Text>
          <Text style={styles.info}>{data.orderInfo.shipping?.contact}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View style={styles.table}>
        <Text style={styles.header}>Sales Information</Text>
       
        <TableWithPagination data={[...data.itemsData,]} />

        {/* Terms & Conditions and Total Section */}
        <View style={[styles.tableRow, { height: 150, borderStyle: 'solid', borderWidth: 1 },]}>
          <View style={styles.terms}>
            <Text style={[styles.tableCell,  { color: "grey", textAlign: 'left', width: "80%", paddingTop: 20}]}>Terms & Conditions</Text>
            <Text style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>1.All the invoices should mandatorily be mentioned with Bansi Office
            Solutions Private Limited PO Number & should be attached with PO copy
            ,without which the invoice would be considered invalid.
            </Text>
            <Text style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>
              2.All the invoices should be mentioned with vendor bank details.
              </Text>
          </View>
          <View style={[styles.tableCol, styles.section, { height: 80}]}>
            <View style={styles.address}>
              <Text style={[styles.tableCell, { textAlign: 'right'}]}>Sub Total:</Text>
              <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>GST:</Text>
              <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>Total:</Text>
            </View>
            <View style={styles.address}>
              <Text style={[styles.tableCell, { textAlign: 'right'}]}>{data.orderInfo.subTotal}</Text>
              <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{data.orderInfo.gstTotal}</Text>
              <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{data.orderInfo.total}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.note}>***This is a system-generated PO, no signature required.***</Text>
      </View>
    </Page>
  </Document>
);

const PdfComponent = ({data}) => {
  const handleOpenPdf = async () => {
    const blob = await pdf(<PdfDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  console.log(data)
  return (
    <div>
      <PDFDownloadLink document={<PdfDocument data={data} />} fileName={`${data.orderInfo.purchaseOrderNumber}.pdf`}>
        {({ blob, url, loading, error }) =>
          <Button color="primary" outline onClick={handleOpenPdf}>{loading ? 'Loading...' : 'Download PDF'}</Button>
        }
      </PDFDownloadLink>
    </div>
  );
};

export default PdfComponent;

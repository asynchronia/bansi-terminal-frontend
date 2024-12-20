import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { formatDate } from '../../utility/formatDate';
import { Button } from 'reactstrap';
import getPaymentTerm from "../../utility/getPaymentTerm";


// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    height: '100%',
  },
  pageBorder: {
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBottom: 30
  },
  status: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 50,
    padding: "3px 8px",
    textTransform: "capitalize",
    fontSize: 12,
    marginTop: 4
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
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  firstCol: {
    width: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 3
  },
  descCol: {
    width: 200,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 3
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
  note: {
    fontSize: 8,
    fontStyle: 'italic',
    marginTop: 30,
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
      <View style={[styles.tableRow, { backgroundColor: 'lightgray' }]} fixed>
        <View style={[styles.firstCol, { borderLeft: 0 }]}>
          <Text style={styles.tableCell}>#</Text>
        </View>
        <View style={styles.descCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Description
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Qty</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Unit
          </Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>HSN/SAC</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Rate</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Tax %</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: 0 }]}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Amount
          </Text>
        </View>
      </View>

      {/* Table Rows */}
      {data.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <View style={[styles.firstCol, { borderLeft: 0 }]}>
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
              {item.quantity}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.itemUnit}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.hsnCode}
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
          <View style={[styles.tableCol, { borderRight: 0 }]}>
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
      <View style={styles.pageBorder}>
      <View style={[styles.section, { padding: 10}]}>
        <View style={styles.address}>
            <Text style={styles.header}>{data.orderInfo.clientName}</Text>
            <Text style={styles.info}>{data.orderInfo.billing?.branchName}</Text>
            <Text style={styles.info}>{data.orderInfo.billing?.address}</Text>
            <Text style={styles.info}>{data.orderInfo.billing?.contact}</Text>
        </View>
        <View style={styles.address}>
            <Text style={[styles.title, {textAlign: 'right'}]}>PURCHASE ORDER</Text>
            <View style={[styles.section, { justifyContent: 'flex-end'}]}>
              <Text style={styles.status}>{data.orderInfo.status}</Text>
            </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View style={{ paddingHorizontal: 10}}>
        <View style={styles.section}>
            <Text style={[styles.address, styles.info]}>Purchase Order: {data.orderInfo.purchaseOrderNumber}</Text>
            <Text style={[styles.address, styles.info]}>Date: {formatDate(data.orderInfo.createdAt)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.address, styles.info]}>Client GST No.: {data.orderInfo.clientGst}</Text>
          <Text style={[styles.address, styles.info]}>Payment Terms: {getPaymentTerm(data.paymentTerms)}</Text>
        </View>
      </View>

      <View style={[styles.tableRow, { backgroundColor: 'lightgray' }]}>
        <View style={[styles.tableCol, { borderLeft: 0, borderRight: 0}]}>
          <Text style={[styles.tableCell, { textAlign: 'left', }]}>Vendor Address:</Text>
        </View>
        <View style={[styles.tableCol, { borderRight: 0}]}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Deliver To:
          </Text>
        </View>
      </View>
      <View style={styles.tableRow}>
        <View style={[styles.tableCol, { paddingVertical: 5, borderLeft: 0, borderRight: 0}]}>
          <Text style={[styles.tableCell, styles.info, { textAlign: 'left' }]}>Bansi Office Solutions Private Limited</Text>
          <Text style={[styles.tableCell, styles.info, { textAlign: 'left' }]}>#1496, 19th Main Road, Opp Park Square Apartment, HSR Layout, Bangalore Karnataka 560102, India</Text>
          <Text style={[styles.tableCell, styles.info, { textAlign: 'left' }]}>Web: www.willsmeet.com, Email:sales@willsmeet.com</Text>
        </View>
        <View style={[styles.tableCol, { paddingVertical: 5, borderRight: 0}]}>
          <Text style={[styles.tableCell, styles.info, { textAlign: 'left' }]}>{data.orderInfo.shipping?.branchName}</Text>
          <Text style={[styles.tableCell, styles.info, { textAlign: 'left' }]}>{data.orderInfo.shipping?.address}</Text>
          <Text style={[styles.tableCell, styles.info, { textAlign: 'left' }]}>{data.orderInfo.shipping?.contact}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <Text style={[styles.header, { padding: 5}]}>Sales Information</Text>
       
        <TableWithPagination data={[...data.itemsData,]} />

        {/* Terms & Conditions and Total Section */}
        <View style={[styles.tableRow, { height: 150, }]}>
          <View style={[styles.terms, { borderRight: 0}]}>
            <Text style={[styles.tableCell,  { color: "grey", textAlign: 'left', width: "80%", paddingTop: 20}]}>Terms & Conditions</Text>
            <Text style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>1.All the invoices should mandatorily be mentioned with Bansi Office
            Solutions Private Limited PO Number & should be attached with PO copy
            ,without which the invoice would be considered invalid.
            </Text>
            <Text style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>
              2.All the invoices should be mentioned with vendor bank details.
              </Text>
          </View>
          <View style={{ width: '40%',}}>
            <View style={[styles.tableCol, styles.section, { height: 80, marginBottom: 0, borderRight: 0}]}>
              <View style={styles.address}>
                <Text style={[styles.tableCell, { textAlign: 'right'}]}>Sub Total:</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>GST:</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>Total:</Text>
              </View>
              <View style={styles.address}>
                <Text style={[styles.tableCell, { textAlign: 'right'}]}>{parseFloat(data.orderInfo.subTotal).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{parseFloat(data.orderInfo.gstTotal).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{parseFloat(data.orderInfo.total).toFixed(2)}</Text>
              </View>
            </View>
            <View style={[styles.tableCol, styles.section, { height: 30, marginBottom: 20, borderTop: 0, borderRight: 0}]}>
              <View>
                <Text style={styles.note}>***This is a system-generated PO, no signature required.***</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
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
      {/* <PDFDownloadLink document={<PdfDocument data={data} />} fileName={`${data.orderInfo.purchaseOrderNumber}.pdf`}>
        {({ blob, url, loading, error }) =>
          <Button color="primary" outline onClick={handleOpenPdf}>{loading ? 'Loading...' : 'Download PDF'}</Button>
        }
      </PDFDownloadLink> */}
      <Button color="primary" outline onClick={handleOpenPdf}>Download PDF</Button>
    </div>
  );
};

export default PdfComponent;

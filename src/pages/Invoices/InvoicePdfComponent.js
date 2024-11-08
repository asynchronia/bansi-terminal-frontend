import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, pdf, Image } from '@react-pdf/renderer';
import { formatDate } from '../../utility/formatDate';
import { Button } from 'reactstrap';
import { formatCamelCase, indianNumberWords } from './invoiceUtil';


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
    width: 100,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  hsnCol: {
    width: 60,
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 10,
  },
  logoImage: {
    height: 80,
    width: 120,
  },
  cardImageSeal: {
    height: 100,
    width: 100,
    marginLeft: '30%'
  }
});

// Function to display table with pagination
const TableWithPagination = ({ data }) => {
  let rowData = [];
  let resp = data.responseObj?.line_items;
  resp.map((val) => {
    let obj = { ...val };
    val.line_item_taxes.map((item) => {
    if (item.tax_name.indexOf("SGST") != -1) {
      let s = item.tax_name.split(" ")[1];
      obj.sgst = s.substring(1, s.lastIndexOf(")"));
      obj.sgst_tax = item.tax_amount;
    } else if (item.tax_name.indexOf("CGST") != -1) {
      let s = item.tax_name.split(" ")[1];
      obj.cgst = s.substring(1, s.lastIndexOf(")"));
      obj.cgst_tax = item.tax_amount;
    }
    });
    rowData.push(obj);
  });
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
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Qty</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Unit
          </Text>
        </View>
        <View style={styles.hsnCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>HSN/SAC</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Rate</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>CGST</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Tax Amt</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>SGST</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Tax Amt</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>
            Amount
          </Text>
        </View>
      </View>

      {/* Table Rows */}
      {rowData.map((item, index) => (
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
              {item.description}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.quantity}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.unit}
            </Text>
          </View>
          <View style={styles.hsnCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.hsn_or_sac}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.rate}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.cgst}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.cgst_tax}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.sgst}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.sgst_tax}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.item_total}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Define the PDF document structure
const PdfDocument = ({data}) => {
  const amountText = formatCamelCase(indianNumberWords(data.responseObj.sub_total));
  let cgst = "",
  sgst = "";
  data.responseObj.taxes.map((val) => {
    if (val.tax_name.indexOf("CGST") !== -1) {
      cgst = val.tax_amount;
    } else if (val.tax_name.indexOf("SGST") !== -1) {
      sgst = val.tax_amount;
    }
  });

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
        <View  style={[styles.address, { width: '35% !important'}]}>
            <Text style={[styles.title, {textAlign: 'right'}]}>TAX INVOICE</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View>
        <View style={styles.section}>
            <Text style={[styles.address, styles.info]}>Invoice Number: {data.responseObj.invoice_number}</Text>
            <Text style={[styles.address, styles.info]}>Date: {formatDate(data.responseObj.date)}</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.address, styles.info]}>Order ID: {data.responseObj.salesorder_number}</Text>
          <Text style={[styles.address, styles.info]}>Place of Supply: {data.responseObj.place_of_supply}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View style={styles.addressSection}>
        <View style={styles.address}>
          <Text style={styles.header}>Billing Address:</Text>
          <Text style={styles.info}>{data.responseObj.billing_address?.attention},</Text>
          <Text style={styles.info}>{data.responseObj.billing_address?.address},</Text>
          <Text style={styles.info}>{data.responseObj.billing_address?.city} - {data.responseObj.billing_address?.zip}, {data.responseObj.billing_address?.state}</Text>
          <Text style={styles.info}>{data.responseObj.billing_address?.phone}</Text>
        </View>
        <View style={styles.address}>
          <Text style={styles.header}>Shipping Address:</Text>
          <Text style={styles.info}>{data.responseObj.shipping_address?.attention},</Text>
          <Text style={styles.info}>{data.responseObj.shipping_address?.address},</Text>
            <Text style={styles.info}>{data.responseObj.shipping_address?.city} - {data.responseObj.shipping_address?.zip}, {data.responseObj.billing_address?.state}</Text>
          <Text style={styles.info}>{data.responseObj.shipping_address?.phone}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      <View style={styles.table}>
        <Text style={styles.header}>Invoice Information</Text>
       
        <TableWithPagination data={data} />

        {/* Terms & Conditions and Total Section */}
        <View style={[styles.tableRow, { height: "auto", borderStyle: 'solid', borderWidth: 1 },]}>
          <View style={[styles.terms, {paddingBottom: 20}]}>
            <Text style={[styles.tableCell,  { color: "grey", textAlign: 'left', width: "80%", paddingTop: 16}]}>Total in words</Text>
            <Text style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>
                {"Indian Rupee " +
                amountText.charAt(0).toUpperCase() +
                amountText.slice(1)}
            </Text>
            <Text style={[styles.tableCell,  { color: "grey", textAlign: 'left', width: "80%", paddingTop: 16}]}>Notes</Text>
            <Text style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>
                {data.responseObj.notes}
            </Text>
            <Text style={[styles.tableCell,  { color: "grey", textAlign: 'left', width: "80%", paddingTop: 16}]}>Terms & Conditions</Text>
            {data.responseObj.terms.split(/\r?\n/).map((term, index) => (
                <Text key={index} style={[styles.tableCell, { textAlign: 'left', width: "80%"}]}>
                    {term}
                </Text>
            ))}
          </View>
          <View style={{width: '35% !important'}}>
            <View style={[styles.tableCol, styles.section, { height: 50}]}>
                <View style={styles.address}>
                <Text style={[styles.tableCell, { textAlign: 'right'}]}>Sub Total:</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>CGST:</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>CGST:</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>Taxable Amount</Text>
                </View>
                <View style={styles.address}>
                <Text style={[styles.tableCell, { textAlign: 'right'}]}>{parseFloat(data.responseObj.sub_total).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{parseFloat(cgst).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{parseFloat(sgst).toFixed(2)}</Text>
                <Text style={[styles.tableCell, { textAlign: 'right', paddingTop: 3}]}>{parseFloat(data.responseObj.tax_total).toFixed(2)}</Text>
                </View>
            </View>
            <Image src={require("../../assets/images/bansi-seal.png")} style={[styles.cardImageSeal]} />
          </View>
        </View>
      </View>
    </Page>
  </Document>
)};

const InvoicePdfComponent = ({data}) => {
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

export default InvoicePdfComponent;

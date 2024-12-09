import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import StyledButton from '../../components/Common/StyledButton';
import getPaymentTerm from '../../utility/getPaymentTerm';
import { formatDate } from '../../utility/formatDate';
import { Button } from 'reactstrap';


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
    width: 50,
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  firstCol: {
    width: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  descCol: {
    width: 130,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 1,
  },
  titleCol: {
    width: 70,
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
  },
  skuCol: {
    width: 100,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 1,
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
        <View style={styles.descCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Item Id</Text>
        </View>
        <View style={styles.titleCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Title</Text>
        </View>
        <View style={styles.skuCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Sku</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Selling Price</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Attribute</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Tax</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Unit</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={[styles.tableCell, { textAlign: 'left' }]}>Type</Text>
        </View>
      </View>

      {/* Table Rows */}
      {data.map((item, index) => (
        <View style={styles.tableRow} key={index}>
          <View style={styles.firstCol}>
            <Text style={styles.tableCell}>{index + 1}</Text>
          </View>
          <View style={styles.descCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.itemId}
            </Text>
          </View>
          <View style={styles.titleCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.title}
            </Text>
          </View>
          <View style={styles.skuCol}>
            <Text style={[styles.tableCell, { textAlign: 'left' }]}>
              {item.sku}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.sellingPrice}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.attributes.map(attr => `${attr.name}: ${attr.value}`).join(", ")}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.tax}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.unit}
            </Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>
              {item.type}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

// Define the PDF document structure
const PdfDocument = ({data}) => {
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
        <Text style={[styles.title, {textAlign: 'center'}]}>AGREEMENT DETAILS</Text>
      </View>

      <View style={[styles.section, { paddingVertical: 10}]}>
        <View>
            <Text style={[styles.info, { paddingVertical: 4}]}>Name: {data.name}</Text>
            <Text style={[styles.info, { paddingVertical: 4}]}>Email: {data.email}</Text>
            <Text style={[styles.info, { paddingVertical: 4}]}>Contact: {data.contact}</Text>
            <Text style={[styles.info, { paddingVertical: 4}]}>Agreement Validity: {formatDate(data.validity)}</Text>
            <Text style={[styles.info, { paddingTop: 4}]}>Payment Terms: {getPaymentTerm(data.paymentTerms)}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <Text style={[styles.header, { paddingBottom: 10}]}>Agreement Item</Text>

        <TableWithPagination data={data.displayTableData} />

      </View>
    </Page>
  </Document>
)};

const AgreementPdfComponent = ({data}) => {
  const handleOpenPdf = async () => {
    const blob = await pdf(<PdfDocument data={data} />).toBlob();
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
  };

  console.log(data)
  return (
    <>
      {/* <PDFDownloadLink document={<PdfDocument data={data} />} fileName={`${data.purchaseOrderNumber}.pdf`}>
        {({ blob, url, loading, error }) =>
          <Button color="primary" outline onClick={handleOpenPdf}>{loading ? 'Loading...' : 'Download PDF'}</Button>
        }
      </PDFDownloadLink> */}
      {data.page === 'client' ? (
        <Button color="primary" size="sm"
          onClick={handleOpenPdf}>
          <i className="mdi mdi-download mx-2"></i>
          Download PDF
        </Button>
      )
      : (
        <StyledButton color={'primary'} onClick={handleOpenPdf} type="button" className={'w-md agreement-btn'}>
            <i className={'btn-icon mdi mdi-download'}></i>
            Download Agreement
        </StyledButton>
      )}
    </>
  );
};

export default AgreementPdfComponent;
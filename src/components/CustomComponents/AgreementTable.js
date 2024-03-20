import React, { useRef } from "react";
import { CardHeader, Table } from "reactstrap";

const AgreementTable = (props) => {
  const sellingPriceRef = useRef("");

  const handleSellingPrice = (event, agreementId) => {
    const { value } = event.target;

    const updatedAgreementData = agreementData.map((data) => {
      if (data.id === agreementId) {
        return { ...data, sellingPrice: value };
      }
      return data;
    });

    setAgreementData(updatedAgreementData);
  };

  const { agreementData, setAgreementData } = props;

  const handleDeleteAgreement = (agreementId) => {
    const newArr = agreementData.filter((e) => {
      return e.id !== agreementId;
    });

    setAgreementData(newArr);
  };
  return (
    <Table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>SKU</th>
          <th>Cost Price</th>
          <th> Selling Price</th>
          <th></th>
        </tr>
      </thead>

      <tbody id="agreementBody">
        {agreementData.length > 0
          ? agreementData.map((data) => (
              <tr key={data.id}>
                <td className="pt-4">{data.title}</td>
                <td className="pt-4">{data.sku}</td>
                <td className="pt-4">{data.costPrice}</td>
                <td>
                  <input
                    type="text"
                    value={data?.sellingPrice || ""}
                    className="form-control"
                    onChange={(event) => {
                      handleSellingPrice(event, data.id);
                    }}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={() => {
                      handleDeleteAgreement(data.id);
                    }}
                  >
                    <i className="mdi mdi-18px mdi-delete"></i>
                  </button>
                </td>
              </tr>
            ))
          : null}
      </tbody>
    </Table>
  );
};

export default AgreementTable;

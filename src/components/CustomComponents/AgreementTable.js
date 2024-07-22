import { Chip } from "@mui/material";
import React, { useRef } from "react";
import { Button, CardHeader, Table } from "reactstrap";

const AgreementTable = (props) => {
  const {
    editable,
    displayTableData,
    setDisplayTableData,
    agreementData,
    setAgreementData,
  } = props;

  // const sellingPriceRef = useRef("");

  const handleSellingPrice = (event, variantId, itemId) => {
    const { value } = event.target;

    const updatedDisplayTableData = displayTableData.map((data) => {
      if (data.id === variantId) {
        return { ...data, sellingPrice: value };
      }
      return data;
    });

    setDisplayTableData(updatedDisplayTableData);

    const updatedAgreementData = agreementData.map((agreement) => {
      if (agreement.item === itemId) {
        const updatedVariants = agreement.variants.map((variant) => {
          if (variant.variant === variantId) {
            return { ...variant, price: value };
          }
          return variant;
        });
        return { ...agreement, variants: updatedVariants };
      }
      return agreement;
    });

    setAgreementData(updatedAgreementData);
  };

  const handleDeleteAgreement = (variantId) => {
    const newArr = displayTableData.filter((e) => {
      return e.id !== variantId;
    });

    setDisplayTableData(newArr);

    const updatedAgreementData = agreementData
      .map((agreement) => {
        const updatedVariants = agreement.variants.filter(
          (variant) => variant.variant !== variantId
        );
        if (updatedVariants.length === 0) {
          // Remove the entire agreement object if variants array becomes empty
          return null;
        } else {
          return { ...agreement, variants: updatedVariants };
        }
      })
      .filter(Boolean); // Filter out null values

    setAgreementData(updatedAgreementData);
  };


  return (
    <Table>
      <thead>
        <tr>
          <th>Product Name</th>
          <th>SKU</th>
          <th style={{ width: '20%' }}>Cost</th>
          <th>Tax Bracket</th>
          {editable && <th>Action</th>}
        </tr>
      </thead>
      <tbody id="agreementBody">
        {displayTableData?.length > 0
          ? displayTableData.map((data) => (
            <tr key={data.id} style={{ verticalAlign: 'middle' }}>
              <td>
                <span>{data.title}</span>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {data.type === 'variable' ?
                    data.attributes.map((attribute, index) => (
                      <Chip size="small" key={index} label={`${attribute.name}: ${attribute.value}`} />
                    )) : null
                  }
                </div>
              </td>
              <td >{data.sku}</td>

              {editable ? (
                <td>
                  <input
                    type="text"
                    value={data?.sellingPrice || ""}
                    className="form-control"
                    onChange={(event) => {
                      handleSellingPrice(event, data.id, data.itemId);
                    }}
                  />
                </td>
              ) : (
                <td >₹{`${data?.sellingPrice}/per ${data.unit}` || ""}</td>
              )}
              <td >{data?.tax}</td>
              {editable ? (
                <td>
                  <Button color="danger" size="sm" outline
                    onClick={() => {
                      handleDeleteAgreement(data.id);
                    }}
                  >
                    <i className="mdi mdi-18px mdi-delete"></i>
                  </Button>
                </td>
              ) : null}
            </tr>
          ))
          : null}
      </tbody>
    </Table>
  );
};

export default AgreementTable;

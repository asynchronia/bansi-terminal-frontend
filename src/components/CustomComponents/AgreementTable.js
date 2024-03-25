import React, { useRef } from "react";
import { CardHeader, Table } from "reactstrap";

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
          <th>Cost Price</th>
          <th> Selling Price</th>
          <th></th>
        </tr>
      </thead>

      <tbody id="agreementBody">
        {displayTableData?.length > 0
          ? displayTableData.map((data) => (
              <tr key={data.id}>
                <td className="pt-4">{data.title}</td>
                <td className="pt-4">{data.sku}</td>
                <td className="pt-4">{data.costPrice}</td>
                <td>
                  {editable?<input
                    type="text"
                    value={data?.sellingPrice || ""}
                    className="form-control"
                    onChange={(event) => {
                      handleSellingPrice(event, data.id, data.itemId);
                    }}
                  />
                  :
                  data?.sellingPrice || ""}
                </td>
                {editable?<td>
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light"
                    onClick={() => {
                      handleDeleteAgreement(data.id);
                    }}
                  >
                    <i className="mdi mdi-18px mdi-delete"></i>
                  </button>
                </td>:null}
              </tr>
            ))
          : null}
      </tbody>
    </Table>
  );
};

export default AgreementTable;

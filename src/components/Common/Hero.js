import React from "react";

const Hero = () => {
    return (
        <React.Fragment>
            <div className="image-container">
                <img
                    src={require("../../assets/images/Willsmeet-Logo.png")}
                    alt="Company Logo"
                    className="card-image"
                />
            </div>
            <div className="details">
                <h3 className="fw-bolder">
                    Bansi Office Solutions Private Limited
                </h3>
                <p className="m-0">
                    #1496, 19th Main Road, Opp Park Square Apartment, HSR Layout,
                    Bangalore Karnataka 560102, India
                </p>
                <p className="m-0">
                    GSTIN: 29AAJCB1807A1Z3 CIN:U74999KA2020PTC137142
                </p>
                <p className="m-0">MSME No : UDYAM-KR-03-0065095</p>
                <p className="m-0">
                    Web: www.willsmeet.com, Email:sales@willsmeet.com
                </p>
            </div>
        </React.Fragment>
    )
}

export default Hero;
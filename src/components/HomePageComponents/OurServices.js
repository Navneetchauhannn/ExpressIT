import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../../images/our-services.png";
import img2 from "../../images/our-services2.png";
import img3 from "../../images/our-services3.png";
import img4 from "../../images/our-services4.png";
const OurServices = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div
        className="container-fluid our-services px-md-5"
        style={{ padding: "0 30px" }}
      >
        <h2 style={{ paddingTop: "40px" }}>
          Our Services 
          <div className="line"></div>
        </h2>
        <div
          className="row d-flex justify-content-center flex-md-nowrap mt-5"
          style={{ borderRadius: "5px" }}
        >
          <div
            className="col-md-3 card mx-2"
            style={{ border: "0", padding: "15px 5px" }}
          >
            <div
              className="our-services-icon mx-auto pt-3"
              style={{ marginBottom: "-10px" }}
            >
              <img src={img} className="card-img-top" alt="..." height={150} />
            </div>
            <div className="card-body text-center">
              <h5
                className="card-title text-center"
                style={{ margin: "10px 0" }}
              >
               Express IT
              </h5>
              <p className="card-text" style={{ fontSize: "14px" }}>
              Express IT Express IT Express IT Express IT Express IT Express ITExpress ITExpress ITExpress ITExpress
              </p>
            </div>
          </div>
          <div
            className="col-md-3 card"
            style={{ border: "0", padding: "15px 5px" }}
          >
            <div
              className="our-services-icon mx-auto pt-3"
              style={{ marginBottom: "-10px" }}
            >
              <img src={img2} className="card-img-top" alt="..." height={150} />
            </div>
            <div className="card-body text-center">
              <h5
                className="card-title text-center"
                style={{ margin: "10px 0" }}
              >
                Express IT
              </h5>
              <p className="card-text" style={{ fontSize: "14px" }}>
              Express IT Express IT Express IT Express IT Express ITExpress ITExpress ITExpress ITExpress IT
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              navigate(`/rent`);
            }}
            className="col-md-3 card mx-2"
            style={{ border: "0", padding: "15px 5px" }}
          >
            <div
              className="our-services-icon mx-auto pt-3"
              style={{ marginBottom: "-10px" }}
            >
              <img src={img3} className="card-img-top" alt="..." height={150} />
            </div>
            <div className="card-body text-center">
              <h5
                className="card-title text-center"
                style={{ margin: "10px 0" }}
              >
                Express IT
              </h5>
              <p className="card-text" style={{ fontSize: "14px" }}>
              Express IT Express IT Express IT Express ITExpress ITExpress ITExpress ITExpress ITExpress IT
              </p>
            </div>
          </div>
          <div
            onClick={() => {
              navigate(`/refurbish`);
            }}
            className="col-md-3 card"
            style={{ border: "0", padding: "15px 5px" }}
          >
            <div
              className="our-services-icon mx-auto pt-3"
              style={{ marginBottom: "-10px" }}
            >
              <img src={img4} className="card-img-top" alt="..." height={150} />
            </div>
            <div className="card-body text-center">
              <h5
                className="card-title text-center"
                style={{ margin: "10px 0" }}
              >
               Express IT
              </h5>
              <p className="card-text" style={{ fontSize: "14px" }}>
              Express IT Express IT Express ITExpress ITExpress ITExpress ITExpress ITExpress ITExpress ITExpress IT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurServices;

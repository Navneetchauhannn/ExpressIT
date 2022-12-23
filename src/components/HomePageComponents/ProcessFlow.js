import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
// import image;
const ProcessFlow = () => {
    const userDataCollectionRefDocumentData = collection(db, "NoticeboardData");
    const [HighlightedData, SetHighlightedData] = useState([]);
    const [role, setRole] = useState("");

    const GetHighlightedData = async () => {
        let q;
        q = query(userDataCollectionRefDocumentData, orderBy("date", "asc"));
        const data = await getDocs(q);
        SetHighlightedData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    //console.log(HighlightedData);

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                setRole(localStorage.getItem("1111"));
            }
            else {
                // navigate("/signIn");
            }
        })
        GetHighlightedData();
    }, [])


    return (
        <div>
            <section className="section">
                <div className="container mt-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="section-title me-5">
                                <h3 className="title">Events held in IT Department </h3>
                                <p className="text-muted">Events held in IT Department</p>
                                <div
                                    className="process-menu nav flex-column nav-pills"
                                    id="v-pills-tab"
                                    role="tablist"
                                    aria-orientation="vertical"
                                >
                                    {
                                        HighlightedData.map((curdata, index) => (
                                            <a
                                                className="nav-link active"
                                                id="v-pills-home-tab"
                                                data-bs-toggle="pill"
                                                href="#v-pills-home"
                                                role="tab"
                                                aria-controls="v-pills-home"
                                                aria-selected="true"
                                                key={curdata.id}
                                            >
                                                <div className="d-flex">
                                                    <div className="number flex-shrink-0">{index + 1}</div>
                                                    <div className="flex-grow-1 text-start ms-3">
                                                        <h5 className="fs-18">
                                                            <span style={{fontSize:"28px"}}>  {curdata.eventname}</span>
                                                        </h5>
                                                        <p className="text-muted mb-0">
                                                            {curdata.eventdescription} <br />
                                                            {curdata.date}
                                                        </p>
                                                        <a target="_blank" href={curdata.fileUrl}><Button style={{ backgroundColor: "#800080" }} >Download</Button></a>
                                                        {
                                                            role === "111" || role === "101" ?
                                                                <a style={{paddingLeft:"50px"}} target="_blank" href={curdata.fileUrl}><Button style={{ backgroundColor: "#800080" }} >Remove</Button></a>
                                                                : <></>

                                                        }
                                                    </div>
                                                </div>
                                            </a>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProcessFlow;

import { Button, Modal } from "antd";
import React, { useState } from "react";

const DocumentList = ({ documents,deleteDocumentHandler }) => {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');

  };

  const [documentId,setDocumentId] = useState();

  const [isModalOpenDel, setIsModalOpenDel] = useState(false);
  const showModalDel = (id) => {
    setDocumentId(id)
    setIsModalOpenDel(true);
  };
  const handleOkDel = (id) => {
    deleteDocumentHandler(id)
    setIsModalOpenDel(false);
  };
  const handleCancelDel = () => {
    setIsModalOpenDel(false);
  };
  return (
    <div className="row">
      <div className="col-md-12">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th width="150">Tiêu đề</th>
              <th width="150">Chủ đề</th>
              <th>Bài giảng</th>
            </tr>
          </thead>
          <tbody>
            {documents &&
              documents.map((document) => {
                return (
                  <tr>
                    <td>{document.name}</td>
                    <td>{document.topic}</td>
                    <td>
                      {document.docs.map((doc) => {
                        return (
                          <>
                            <button
                              style={{width:'100px',height:'100px',marginRight:'10px',background:'white'}}
                              role="link"
                              onClick={() => openInNewTab(`http://localhost:4000${doc}`)}
                            >
                              <i style={{fontSize:'40px',color:'red'}} className="fa fa-file-pdf-o " aria-hidden="true"></i>
                              <div>{document.name}</div>
                            </button>

                            <Modal title="Xóa chủ đề" open={isModalOpenDel} onOk={() => handleOkDel(documentId)} onCancel={handleCancelDel} okText={"Hoàn thành"} cancelText={"Hủy bỏ"}>
                                Bạn có chắc sẽ xóa chủ đề này
                            </Modal>
                            
                            <Button onClick={() => showModalDel(document._id)} >Xóa</Button>
                          </>

                        );
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentList;

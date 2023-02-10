import React from "react";

const DocumentList = ({ documents,deleteDocumentHandler }) => {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
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
 
                            
                            <button onClick={() => deleteDocumentHandler(document._id)}>Xóa</button>
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

import React from "react";

const UploadsList = ({ medias,deleteLessonHandler }) => {
  
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
            {medias &&
              medias.map((media) => {
                return (
                  <tr>
                    <td>{media.name}</td>
                    <td>{media.topic}</td>
                    <td>
                      {media.videos.map((video) => {
                        return (
                          <>
                            <video
                            preload="auto"
                            width="320"
                            height="240"
                            controls
                            >
                              <source src={process.env.REACT_APP_API_URL+ video} />
                              
                            </video>
                            <button onClick={() => deleteLessonHandler(media._id)}>Xóa</button>
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

export default UploadsList;

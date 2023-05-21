import React, { useState } from "react";
import Questions from "./Questions";
import { Pagination } from "antd";
const QuestionList = ({ questionsList }) => {

  const [currentPage, setCurrentPage ] = useState(1);

  const pageSize = 10

  return (
    <>

      {questionsList.filter((item,index) => index >= (currentPage - 1)*pageSize & index <= (currentPage*pageSize - 1) ).map((question) => (
        <Questions question={question} key={question._id} />
      ))}

      <Pagination 
        style={{float:'right',marginTop:'10px'}} 
        onChange={(page) => setCurrentPage(page)} 
        defaultCurrent={1} 
        total={questionsList.length} 
        pageSize={pageSize} 
      />
    </>
  );
};

export default QuestionList;

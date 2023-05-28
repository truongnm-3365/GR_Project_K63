import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import './index.css'
import CustomToolbar from "./CustomToolbar";
export default function Editor({className="toolbar",value,onChange}) {
  // const modules = {
  //   toolbar: [
  //     [{ header: [1, 2, false] }],
  //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //     [
  //       { list: 'ordered' },
  //       { list: 'bullet' },
  //       { indent: '-1' },
  //       { indent: '+1' },
  //     ],
  //     ['link', 'image'],
  //     ['clean'],
  //   ],
  // };
  const modules = {
    toolbar: {
        container: `.${className}`,
    }
}
  const formats = [
    'font','size',
    'bold','italic','underline','strike',
    'color','background',
    'script',
    'header','blockquote','code-block',
    'indent','list',
    'direction','align',
    'link','image','video',
  ]
  return (
    <div>
      <CustomToolbar className={className}/>
      <ReactQuill
        defaultValue={value}
        onChange={onChange}
        modules={modules} 
        formats={formats}
        />    
    </div>

   
  );
}



import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const QuillEditor = ({editorHtml, setEditorHtml}) => {

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  return (
    <div>
      <ReactQuill
        value={editorHtml}
        onChange={handleChange}
        theme="snow"
        modules={QuillEditor.modules}
        formats={QuillEditor.formats}
      />
    </div>
  );
};

// Quill modules and formats
QuillEditor.modules = {
   toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      [{ 'size': ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '40px'] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'] // remove formatting button
    ] 
 };
 
 QuillEditor.formats = [
   'bold', 'italic', 'underline',
   'align',
   'list', 'bullet',
   'indent',
   'link',
   'size',
   'color', 'background'
 ];
 

export default QuillEditor;
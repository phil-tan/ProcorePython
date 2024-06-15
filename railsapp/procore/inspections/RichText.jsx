// import {
//   EditorState,
//   ContentState,
//   convertToRaw,
//   convertFromHTML,
// } from 'draft-js'
// import redraft from 'redraft'

// const RichText = ({ note }) => {
//   const blocksFromHTML = convertFromHTML(note);
//   const initialState = ContentState.createFromBlockArray(
//     blocksFromHTML.contentBlocks,
//     blocksFromHTML.entityMap,
//   );
//   const editorState = EditorState.createWithContent(initialState);
//   const rawContent = convertToRaw(editorState.getCurrentContent());
//   return redraft(rawContent, renderers, { blockFallback: 'unstyled' });
// };
// export default RichText;

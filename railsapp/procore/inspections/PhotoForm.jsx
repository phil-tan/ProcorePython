import React from 'react'
import Image from '../observations/pages/Image'
import { shorten_url } from '../../functions/functions'

const PhotoForm = ({photo}) => {
  return (
    <td
      style={{
        width: "50%",
        height: "300px",
        marginRight: 2,
      }}
    >
    <form>
      <div style={{
            padding: 5,
            border: '1px solid black',
            textAlign: "center",
            backgroundColor: "#FFFFFF",
            height: '100%'
          }}>
        <Image
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            height: "100%",
            marginBottom: 0,
          }}
          src_url={photo.url}
        />
        <a
          href={photo.url}
          style={{ display: "block" }}
          target="_blank"
        >
          {shorten_url(photo.filename)}
        </a>
        <input type='text' className="text-start w-100">{photo.description}</input>
      </div>
    </form>
    </td>
  )
}

export default PhotoForm

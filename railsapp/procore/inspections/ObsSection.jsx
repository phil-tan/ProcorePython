import React from 'react'
import { standardizeFontSize } from '../../functions/functions'
import { shorten_url, statusColor } from '../../functions/functions'
import EditForm from '../observations/pages/EditForm'
import Image from '../observations/pages/Image'


const ObsSection = (props) => {
  return (
  <div>
  <>
  { props.observations.map(obs => {

    const obs_photos = obs.attachments.filter(
            (att) =>
              att.name.endsWith(".jpg") ||
              att.name.endsWith(".jpeg") ||
              att.name.endsWith(".png"))

  return(

  <div className='inspection-obs-item' style={{border: '1px solid black', margin: '3px 0px 3px 0px'}}>
  <div style={
          obs.loading
            ? {
                color: "gray",
                backgroundColor: "whitesmoke",
                fontStyle: "italic",
                border: "blue",
              }
            : {}
        }>
    <div style={{
              width: '100%',
              padding: 5,
              marginBottom: "2px",
            }}>
      {obs.loading ? 'Saving...' : <></>}
      <div className='text-end'><span style={{color: statusColor(obs.status)}}><strong>{obs.status}</strong></span></div>
      <EditForm
            text=<strong>{`${obs.number} - ${obs.name} | [${obs.action_by ? obs.action_by : ''}]`}</strong>
            obs={obs}
            function="edit"
            origin_form='inspection_edit'
          />
      <div
          className="text-justify"
          dangerouslySetInnerHTML={{
            __html: standardizeFontSize(obs.description),
          }}
        ></div>
      </div>
        <table>
        <tbody >
          {obs_photos.map((_, i) => {
            if (i % 2 === 0) {
              let photo_pair = [obs_photos[i]]
              if(obs_photos[i+1]){
                photo_pair.push(obs_photos[i+1])
              }
            return(
              <tr key={i}>
              { photo_pair.map(att =>
                  <td
                    style={{
                      width: "50%",
                      height: "300px",
                      marginRight: 2,
                    }}
                  >
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
                        src_url={att.url}
                      />
                      <a
                        href={att.url}
                        style={{ display: "block" }}
                        target="_blank"
                      >
                        {shorten_url(att.filename)}
                      </a>
                    </div>
                  </td>
              )}
              </tr>
              )}})}
        </tbody>
        </table>
      </div>
    </div>
    ) }
  )}
    </>
  </div>
  )
}

export default ObsSection

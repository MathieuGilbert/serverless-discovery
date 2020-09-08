import React, { FC } from 'react';
import { PixabyPhoto } from "../Types";

type Props = {
  pictures: PixabyPhoto[];
}


const searchResults = (pictures: PixabyPhoto[]) => {
  return pictures.map((p, i) => {
    return (
      <div key={i}>
        <img src={p.previewURL} alt={p.tags} />
      </div>
    )
  })
}

export const SearchResults: FC<Props> = ({ pictures }) => {
  return (
    <section id='searchResults'>
      {pictures && searchResults(pictures)}
    </section>
  )
}
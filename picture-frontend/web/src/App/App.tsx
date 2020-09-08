import React, { FC, useEffect, useState } from 'react';
import { SearchInput } from "../SearchInput";
import { SearchResults } from "../SearchResults";
import './App.css';

import { PixabyPhoto } from "../Types";
import { getPictures } from '../getPictures';


const EMPTY_PICTURES: PixabyPhoto[] = []

const App: FC<{}> = () => {
  const [pictures, setPictures] = useState(EMPTY_PICTURES);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const callApi = async (term: string) => {
      try {
        const { data, errors } = await getPictures(term);
        if (errors) {
          console.log("ERROR:", errors);
          return;
        }
        setPictures(data.getPictures);
      } catch(e) {
        console.log(e);
      }
    }

    if (searchTerm && searchTerm.length >= 3) {
      callApi(searchTerm);
    } else {
      setPictures(EMPTY_PICTURES);
    }
  }, [searchTerm]);

  const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <>
      <h1>Picture Lookup</h1>
      <SearchInput onChange={onChangeSearchTerm} />
      <SearchResults pictures={pictures} />
    </>
  );
}

export default App;

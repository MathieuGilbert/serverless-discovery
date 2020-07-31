import React, { FC } from 'react';
import { DebounceInput } from 'react-debounce-input';

type Props = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export const SearchInput: FC<Props> = ({ onChange }) => {
  return (
    <section id='searchInput'>
    <label>What do you want to see?</label>
    <DebounceInput debounceTimeout={1000} onChange={onChange} />
  </section>
  )
}
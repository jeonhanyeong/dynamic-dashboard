import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';

interface SearchBoxProps {
  isDarkMode: boolean;
  handleDebouncingSearach: (textValue: string) => void;
}

const SearchBox = ({ isDarkMode, handleDebouncingSearach }: SearchBoxProps) => {
  const [debouncedValue, setDebouncedValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDebouncingSearach(debouncedValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    // value 변경 시점에 clearTimeout을 해줘야함.
  }, [debouncedValue]);

  const handleSearching = (e: any) => {
    setDebouncedValue(e.target.value);
  };

  return (
    <TextField
      focused={!!isDarkMode}
      id="input-with-icon-textfield"
      placeholder="타일 필터링"
      fullWidth
      onChange={handleSearching}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" style={{ color: isDarkMode ? '#EDECEB' : '#1976d2' }} />
          </InputAdornment>
        ),
        style: {
          margin: '20px',
          width: '80%',
          height: '30px',
          color: isDarkMode ? '#EDECEB' : '#000',
          borderColor: isDarkMode ? '#EDECEB' : '#000',
        },
      }}
    />
  );
};

export default SearchBox;

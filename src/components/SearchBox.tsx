import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = () => {
  return (
    <TextField
      id="input-with-icon-textfield"
      placeholder="타일 필터링"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        style: {
          margin: '20px',
          width: '80%',
          height: '30px',
        },
      }}
    />
  );
};

export default SearchBox;

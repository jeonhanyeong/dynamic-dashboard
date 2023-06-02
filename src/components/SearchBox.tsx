import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBoxProps {
  isDarkMode: boolean;
}

const SearchBox = ({ isDarkMode }: SearchBoxProps) => {
  return (
    <TextField
      focused={!!isDarkMode}
      id="input-with-icon-textfield"
      placeholder="타일 필터링"
      fullWidth
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

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

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
        },
      }}
    />
  );
};

export default SearchBox;

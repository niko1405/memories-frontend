import { IconButton, InputBase, Paper, Typography, createTheme } from "@material-ui/core";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SearchField = ({ placeHolder = '', style = {}, onInput = _ => {}, onSearch = _ => {}, onClick = _ => {}, searchOnInput = true, width = '300px', backgroundColor = '#ebebeb', elevation = 0, borderRadius = '20px', className = '' }) => {
    const theme = createTheme();
    const { t } = useTranslation();

    const [value, setValue] = useState('');

    const handleChange = (e) => {
        onInput(e.target.value);
        setValue(e.target.value);

        if (searchOnInput)
            onSearch(e.target.value);
    }

    const handlePressEnter = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            onSearch(value);
        }
    }

    const handleClear = () => {
        setValue('');
        onSearch('');
    }

    return (
        <Paper className={className} onClick={(e) => onClick(e, value)} style={{ ...style, width, display: 'flex', alignItems: 'center', borderRadius, backgroundColor, position: 'relative' }} elevation={elevation} >
            <IconButton onClick={() => onSearch(value)} >
                <SearchIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={placeHolder.length ? placeHolder : t('search_placeholder')}
                value={value}
                onChange={handleChange}
                onKeyDown={handlePressEnter}
            />
            <Typography onClick={handleClear} style={{ padding: theme.spacing(1.5), cursor: 'pointer', position: 'absolute', right: 0 }} variant='body1' color='primary'>✖</Typography>
        </Paper>
    );
}

export default SearchField;
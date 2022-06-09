import { Grid, IconButton, InputAdornment } from "@material-ui/core";
import { TextField } from '@mui/material' 

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CustomInput = ({ name, handleChange, label, autoFocus, type, handleShowPassword, half, color = 'primary', helperText = '', error = false, shrink = false, style = undefined, variant = 'outlined', required = true }) => {
    return (
        <Grid item xs={12} sm={half ? 6 : 12}>
            <TextField
                name={name}
                variant={variant}
                onChange={handleChange}
                required={required}
                fullWidth
                label={label}
                autoFocus={autoFocus}
                type={type}
                helperText={helperText}
                error={error}
                style={style}
                InputLabelProps ={{ color }}
                // InputProps = {{ color }}
            // InputProps={name === 'password' ? {
            //     endAdornment: (
            //         <InputAdornment position="end">
            //             <IconButton onClick={handleShowPassword}>
            //                 {type === 'password' ? <Visibility /> : <VisibilityOff />}
            //             </IconButton>
            //         </InputAdornment>
            //     )
            // } : null }
            />
        </Grid>
    );
}

export default CustomInput;

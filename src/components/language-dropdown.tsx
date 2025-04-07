import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../repo/api";
import debounce from "lodash/debounce";

interface Language {
  _id: string;
  languageCode: string;
  languageName: string;
}

interface LanguageDropdownProps {
  value: Language | null;
  onChange: (value: Language | null) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  value,
  onChange,
  label = "Language",
  error = false,
  helperText = "",
  required = false,
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["languages", searchTerm],
    queryFn: () =>
      apiClient.getLanguages({
        search: searchTerm,
        limit: 20,
      }),
    enabled: open,
    staleTime: 300000, // 5 minutes
  });

  const debouncedRefetch = debounce(refetch, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedRefetch();
    }
  }, [searchTerm, debouncedRefetch]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      isOptionEqualToValue={(option, value) =>
        option.languageCode === value.languageCode
      }
      getOptionLabel={(option) =>
        `${option.languageName} (${option.languageCode})`
      }
      options={data?.data || []}
      loading={isLoading}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box>
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {option.languageName}
            </Box>
            <Box component="span" sx={{ ml: 1, color: "text.secondary" }}>
              ({option.languageCode})
            </Box>
          </Box>
        </Box>
      )}
    />
  );
};

export default LanguageDropdown;

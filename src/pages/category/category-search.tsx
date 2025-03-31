import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import apiClient from "../../repo/api";
import { debounce } from "lodash";

interface CategoryOption {
  _id: string;
  categoryName: string;
}

interface CategorySearchProps {
  value: CategoryOption | null;
  onChange: (value: CategoryOption | null) => void;
  label?: string;
}

const CategorySearch: React.FC<CategorySearchProps> = ({
  value,
  onChange,
  label = "Select Category",
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const fetchCategories = async (searchString: string) => {
    try {
      setLoading(true);
      const response = await apiClient.getCategories({
        searchString,
        limit: 10,
      });
      const categories = response.data.map((category) => ({
        _id: category._id,
        categoryName: category.categoryName,
      }));
      setOptions(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce the API call to prevent too many requests
  const debouncedFetch = debounce(fetchCategories, 300);

  useEffect(() => {
    if (open) {
      fetchCategories("");
    }
  }, [open]);

  useEffect(() => {
    // Set initial input value when value prop changes
    if (value) {
      setInputValue(value.categoryName);
    }
  }, [value]);

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      value={value}
      inputValue={inputValue}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => option.categoryName}
      options={options}
      loading={loading}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        debouncedFetch(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default CategorySearch;

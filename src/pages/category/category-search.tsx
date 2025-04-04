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
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchCategories = async (searchString: string, skip: number = 0) => {
    try {
      setLoading(true);
      const response = await apiClient.getCategories({
        searchString,
        limit,
        skip,
      });
      const categories = response.data.map((category) => ({
        _id: category._id,
        categoryName: category.categoryName,
      }));

      if (skip === 0) {
        setOptions(categories);
      } else {
        setOptions((prev) => [...prev, ...categories]);
      }

      setHasMore(categories.length === limit);
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
      setPage(0);
      fetchCategories("");
    }
  }, [open]);

  useEffect(() => {
    // Set initial input value when value prop changes
    if (value) {
      setInputValue(value.categoryName);
    }
  }, [value]);

  const handleScroll = (event: React.SyntheticEvent) => {
    const listboxNode = event.currentTarget;
    if (
      !loading &&
      hasMore &&
      listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 50
    ) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCategories(inputValue, nextPage * limit);
    }
  };

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => {
        setOpen(false);
        setPage(0);
      }}
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
        setPage(0);
        debouncedFetch(newInputValue);
      }}
      ListboxProps={{
        onScroll: handleScroll,
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

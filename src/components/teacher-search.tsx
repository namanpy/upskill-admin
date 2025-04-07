import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import apiClient, { Teacher } from "../repo/api";
import { debounce } from "lodash";

interface TeacherSearchProps {
  value: Teacher | null;
  onChange: (teacher: Teacher | null) => void;
  label?: string;
  required?: boolean;
}

const TeacherSearch: React.FC<TeacherSearchProps> = ({
  value,
  onChange,
  label = "Select Teacher",
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["teachers", searchTerm],
    queryFn: async () => {
      // Load initial teachers if no search term
      if (!searchTerm) {
        return apiClient.getTeachers({ limit: 10 });
      }
      return apiClient.getTeachers({ search: searchTerm, limit: 10 });
    },
    enabled: true,
  });

  const debouncedSearch = debounce(() => {
    refetch();
  }, 300);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => {
        onChange(newValue);
      }}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      getOptionLabel={(option) => `${option.name || ""}`}
      options={data?.teachers || []}
      loading={isLoading}
      onInputChange={(_, newInputValue) => {
        setSearchTerm(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
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
    />
  );
};

export default TeacherSearch;

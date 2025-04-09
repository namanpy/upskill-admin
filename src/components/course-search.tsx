import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../repo/api";
import { debounce } from "lodash";
import type { CourseDisplay } from "../repo/api";

type RequiredCourseData = Pick<
  CourseDisplay,
  "_id" | "courseName" | "courseCode" | "courseMode"
>;
interface CourseSearchProps {
  value: RequiredCourseData | null;
  onChange: (course: RequiredCourseData | null) => void;
  label?: string;
  required?: boolean;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  value,
  onChange,
  label = "Select Course",
  required = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["courseSearch", searchTerm],
    queryFn: () =>
      apiClient.getCourseDisplay({
        search: searchTerm,
        limit: 10,
      }),
    enabled: true, // Changed to true to load initial data
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
      getOptionLabel={(option) => `${option.courseName} (${option.courseCode})`}
      options={data?.data || []}
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
      renderOption={(props, option) => (
        <li {...props}>
          <div>
            {option.courseName}
            <br />
            <small style={{ color: "text.secondary" }}>
              {option.courseCode} - {option.courseMode}
            </small>
          </div>
        </li>
      )}
    />
  );
};

export default CourseSearch;

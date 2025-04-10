import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { COURSE_MODE } from "../../common/constants/course.constants";
import CategorySearch from "../category/category-search";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../../repo/api";
import { useNavigate, useParams } from "react-router-dom";
import LanguageDropdown from "../../components/language-dropdown";
import FileUpload from "../../components/file-upload";
import { COURSE_LEVEL } from "../../common/constants/course.constants";

interface FAQ {
  _id?: string;
  question: string;
  answer: string;
}

interface Topic {
  _id?: string;
  topicName: string;
  active: boolean;
}

interface Chapter {
  _id?: string;
  name: string;
  chapterNumber: number;
  week: number;
  session: number;
  topics: Topic[];
  active: boolean;
}

export interface CourseData {
  _id: string;
  courseName: string;
  category: string;
  categoryName: string;
  courseCode: string;
  courseImage: string;
  courseMode: string;
  courseDuration: string;
  originalPrice: string;
  discountedPrice: string;
  youtubeUrl: string | null;
  brochure: string;
  certificate: string;
  active: boolean;
  chapters: Chapter[];
  faqs: FAQ[];
  courseLevel: {
    code: string;
    name: string;
  };
  language: {
    _id: string;
    languageCode: string;
    languageName: string;
  };
  shortDescription: string;
  tags: string[];
  programDetails: string;
  targetAudience: string[];
}

const CourseEditForm = () => {
  const { courseCode } = useParams<{ courseCode: string }>();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch course data
  const { data: courseData, isLoading } = useQuery({
    queryKey: ["course", courseCode],
    queryFn: () => apiClient.getCourseByCode({ courseCode: courseCode! }),
    enabled: !!courseCode,
  });

  const handleLanguageChange = (
    selectedLanguage: {
      _id: string;
      languageCode: string;
      languageName: string;
    } | null
  ) => {
    setCourse((prev) => ({
      ...prev,
      language: selectedLanguage || course.language,
    }));
  };

  // Initialize state with empty course data
  const [course, setCourse] = useState<CourseData>({
    _id: "",
    courseName: "",
    category: "",
    categoryName: "",
    courseCode: "",
    courseImage: "",
    courseMode: "",
    courseDuration: "",
    originalPrice: "",
    discountedPrice: "",
    youtubeUrl: "",
    brochure: "",
    certificate: "",
    active: true,
    language: {
      _id: "",
      languageCode: "",
      languageName: "",
    },
    courseLevel: {
      code: "",
      name: "",
    },
    chapters: [
      {
        name: "",
        chapterNumber: 1,
        week: 1,
        session: 1,
        topics: [{ topicName: "", active: true }],
        active: true,
      },
    ],
    faqs: [{ question: "", answer: "" }],
    shortDescription: "",
    tags: [],
    programDetails: "",
    targetAudience: [],
  });

  // Update state when course data is fetched
  useEffect(() => {
    if (courseData) {
      setCourse({
        ...courseData,
        courseDuration: courseData.courseDuration.toString(),
        originalPrice: courseData.originalPrice.toString(),
        discountedPrice: courseData.discountedPrice.toString(),
      });
    }
  }, [courseData]);

  const updateCourseMutation = useMutation({
    mutationFn: (courseData: CourseData) => {
      const apiCourseData = {
        ...courseData,
        language: courseData.language._id,
        courseLevel: courseData.courseLevel.code,
        courseId: courseData._id!,
        courseDuration: Number(courseData.courseDuration),
        originalPrice: Number(courseData.originalPrice),
        discountedPrice: Number(courseData.discountedPrice),
        youtubeUrl: courseData.youtubeUrl || null,
      };

      return apiClient.updateCourse(apiCourseData);
    },
    onSuccess: () => {
      setError("");
      setOpenSnackbar(true);
      setTimeout(() => {
        navigate("/courses");
      }, 2000);
    },
    onError: (error: any) => {
      setOpenSnackbar(true);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the course";
      setError(errorMessage);
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleChapterChange = (
    index: number,
    field: string,
    value: string | number | boolean
  ) => {
    const newChapters = [...course.chapters];
    newChapters[index] = { ...newChapters[index], [field]: value };
    setCourse({ ...course, chapters: newChapters });
  };

  const handleTopicChange = (
    cIndex: number,
    tIndex: number,
    field: string,
    value: string | boolean
  ) => {
    const newChapters = [...course.chapters];
    newChapters[cIndex].topics[tIndex] = {
      ...newChapters[cIndex].topics[tIndex],
      [field]: value,
    };
    setCourse({ ...course, chapters: newChapters });
  };

  const handleFAQChange = (
    index: number,
    field: "question" | "answer",
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newFAQs = [...course.faqs];
    newFAQs[index][field] = e.target.value;
    setCourse({ ...course, faqs: newFAQs });
  };

  const addChapter = () => {
    const maxChapterNumber = Math.max(
      ...course.chapters.map((ch) => ch.chapterNumber),
      0
    );
    setCourse({
      ...course,
      chapters: [
        ...course.chapters,
        {
          name: "",
          chapterNumber: maxChapterNumber + 1,
          week: 1,
          session: 1,
          topics: [{ topicName: "", active: true }],
          active: true,
        },
      ],
    });
  };

  const removeChapter = (index: number) => {
    const newChapters = course.chapters.filter((_, i) => i !== index);
    setCourse({ ...course, chapters: newChapters });
  };

  const addTopic = (chapterIndex: number) => {
    const newChapters = [...course.chapters];
    newChapters[chapterIndex].topics.push({ topicName: "", active: true });
    setCourse({ ...course, chapters: newChapters });
  };

  const removeTopic = (chapterIndex: number, topicIndex: number) => {
    const newChapters = [...course.chapters];
    newChapters[chapterIndex].topics = newChapters[chapterIndex].topics.filter(
      (_, index) => index !== topicIndex
    );
    setCourse({ ...course, chapters: newChapters });
  };

  const addFAQ = () => {
    setCourse({
      ...course,
      faqs: [...course.faqs, { question: "", answer: "" }],
    });
  };

  const removeFAQ = (index: number) => {
    const newFAQs = course.faqs.filter((_, i) => i !== index);
    setCourse({ ...course, faqs: newFAQs });
  };

  const handleCategoryChange = (
    selectedCategory: { _id: string; categoryName: string } | null
  ) => {
    setCourse((prev) => ({
      ...prev,
      category: selectedCategory?._id || "",
      categoryName: selectedCategory?.categoryName || "",
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateCourseMutation.mutate(course);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="lg"
      component={Paper}
      sx={{ p: 4, mt: 4, borderRadius: 2 }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 4, fontWeight: "medium" }}
      >
        Edit Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <CategorySearch
            value={
              course.category
                ? { _id: course.category, categoryName: course.categoryName }
                : null
            }
            onChange={handleCategoryChange}
            label="Course Category"
          />

          {/* Add LanguageDropdown after CategorySearch */}
          <LanguageDropdown
            value={course.language}
            onChange={handleLanguageChange}
            label="Course Language"
            required
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="Course Name"
              name="courseName"
              value={course.courseName}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Course Code"
              name="courseCode"
              value={course.courseCode}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 3,
              }}
            >
              <TextField
                select
                fullWidth
                label="Course Mode"
                name="courseMode"
                value={course.courseMode}
                onChange={handleChange}
                required
                variant="outlined"
              >
                {Object.keys(COURSE_MODE).map((mode) => (
                  <MenuItem key={mode} value={mode}>
                    {mode}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Course Level"
                name="courseLevel"
                value={course.courseLevel.code}
                onChange={(e) => {
                  const selectedLevel =
                    COURSE_LEVEL[e.target.value as keyof typeof COURSE_LEVEL];
                  setCourse((prev) => ({
                    ...prev,
                    courseLevel: {
                      code: e.target.value,
                      name: selectedLevel.name,
                    },
                  }));
                }}
                required
                variant="outlined"
              >
                {Object.values(COURSE_LEVEL).map(({ code, name }) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              type="number"
              label="Course Duration (hours)"
              name="courseDuration"
              value={course.courseDuration}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              label="YouTube URL"
              name="youtubeUrl"
              value={course.youtubeUrl}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              type="number"
              label="Original Price"
              name="originalPrice"
              value={course.originalPrice}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              type="number"
              label="Discounted Price"
              name="discountedPrice"
              value={course.discountedPrice}
              onChange={handleChange}
              required
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: "grid", gap: 3 }}>
            <TextField
              fullWidth
              label="Short Description"
              name="shortDescription"
              value={course.shortDescription}
              onChange={handleChange}
              required
              multiline
              rows={3}
              variant="outlined"
            />

            <Box>
              <TextField
                fullWidth
                label="Tags"
                placeholder="Press Enter to add tag"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      setCourse((prev) => ({
                        ...prev,
                        tags: [...prev.tags, value],
                      }));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                variant="outlined"
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {course.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => {
                      setCourse((prev) => ({
                        ...prev,
                        tags: prev.tags.filter((_, i) => i !== index),
                      }));
                    }}
                  />
                ))}
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Program Details"
              name="programDetails"
              value={course.programDetails}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />

            <Box>
              <TextField
                fullWidth
                label="Target Audience"
                placeholder="Press Enter to add audience"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      setCourse((prev) => ({
                        ...prev,
                        targetAudience: [...prev.targetAudience, value],
                      }));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                variant="outlined"
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {course.targetAudience.map((audience, index) => (
                  <Chip
                    key={index}
                    label={audience}
                    onDelete={() => {
                      setCourse((prev) => ({
                        ...prev,
                        targetAudience: prev.targetAudience.filter(
                          (_, i) => i !== index
                        ),
                      }));
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 3,
              alignItems: "start",
            }}
          >
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Course Image
              </Typography>
              <FileUpload
                accept="image/*"
                multiple={false}
                previews={[course.courseImage]}
                onUploadComplete={(files) => {
                  if (files.length > 0) {
                    setCourse((prev) => ({
                      ...prev,
                      courseImage: files[0].fileUrl,
                    }));
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Course Brochure
              </Typography>
              <FileUpload
                accept=".pdf"
                multiple={false}
                attachment={true}
                attachmentName={`upskillab-brochure.pdf`}
                previews={[course.brochure]}
                onUploadComplete={(files) => {
                  if (files.length > 0) {
                    setCourse((prev) => ({
                      ...prev,
                      brochure: files[0].fileUrl,
                    }));
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Certificate Template
              </Typography>
              <FileUpload
                accept="image/*,.pdf"
                multiple={false}
                previews={[course.certificate]}
                onUploadComplete={(files) => {
                  if (files.length > 0) {
                    setCourse((prev) => ({
                      ...prev,
                      certificate: files[0].fileUrl,
                    }));
                  }
                }}
              />
            </Box>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "medium" }}>
              Chapters & Topics
            </Typography>
            {course.chapters.map((chapter, cIndex) => (
              <Paper
                key={cIndex}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "background.default",
                }}
              >
                <Box sx={{ display: "grid", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Chapter Name"
                    value={chapter.name}
                    onChange={(e) =>
                      handleChapterChange(cIndex, "name", e.target.value)
                    }
                    required
                    variant="outlined"
                  />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1">Chapter Number:</Typography>
                    <IconButton
                      onClick={() =>
                        handleChapterChange(
                          cIndex,
                          "chapterNumber",
                          Math.max(1, chapter.chapterNumber - 1)
                        )
                      }
                      disabled={chapter.chapterNumber <= 1}
                      size="small"
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="h6">
                      {chapter.chapterNumber}
                    </Typography>
                    <IconButton
                      onClick={() =>
                        handleChapterChange(
                          cIndex,
                          "chapterNumber",
                          chapter.chapterNumber + 1
                        )
                      }
                      disabled={course.chapters.some(
                        (ch, idx) =>
                          idx !== cIndex &&
                          ch.chapterNumber === chapter.chapterNumber + 1
                      )}
                      size="small"
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", gap: 3 }}>
                    <TextField
                      select
                      label="Week"
                      value={chapter.week}
                      onChange={(e) =>
                        handleChapterChange(
                          cIndex,
                          "week",
                          Number(e.target.value)
                        )
                      }
                      required
                      sx={{ width: "200px" }}
                    >
                      {[...Array(52)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          Week {i + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Session"
                      value={chapter.session}
                      onChange={(e) =>
                        handleChapterChange(
                          cIndex,
                          "session",
                          Number(e.target.value)
                        )
                      }
                      required
                      sx={{ width: "200px" }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>
                          Session {i + 1}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Topics
                    </Typography>
                    <Box sx={{ display: "grid", gap: 2 }}>
                      {chapter.topics.map((topic, tIndex) => (
                        <Box
                          key={tIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "background.paper",
                            p: 2,
                            borderRadius: 1,
                          }}
                        >
                          <TextField
                            fullWidth
                            label={`Topic ${tIndex + 1}`}
                            value={topic.topicName}
                            onChange={(e) =>
                              handleTopicChange(
                                cIndex,
                                tIndex,
                                "topicName",
                                e.target.value
                              )
                            }
                            required
                            variant="outlined"
                            size="small"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={topic.active}
                                onChange={(e) =>
                                  handleTopicChange(
                                    cIndex,
                                    tIndex,
                                    "active",
                                    e.target.checked
                                  )
                                }
                                size="small"
                              />
                            }
                            label="Active"
                          />
                          <IconButton
                            onClick={() => removeTopic(cIndex, tIndex)}
                            disabled={chapter.topics.length === 1}
                            size="small"
                          >
                            <Remove />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      onClick={() => addTopic(cIndex)}
                      variant="outlined"
                      sx={{ mt: 2 }}
                      startIcon={<Add />}
                    >
                      Add Topic
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={chapter.active}
                          onChange={(e) =>
                            handleChapterChange(
                              cIndex,
                              "active",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Chapter Active"
                    />
                    <Button
                      onClick={() => removeChapter(cIndex)}
                      variant="contained"
                      color="error"
                      disabled={course.chapters.length === 1}
                      startIcon={<Remove />}
                    >
                      Remove Chapter
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}
            <Button onClick={addChapter} variant="outlined" startIcon={<Add />}>
              Add Chapter
            </Button>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "medium" }}>
              Frequently Asked Questions
            </Typography>
            {course.faqs.map((faq, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "background.default",
                }}
              >
                <Box sx={{ display: "grid", gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Question"
                    value={faq.question}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFAQChange(index, "question", e)
                    }
                    required
                    variant="outlined"
                  />
                  <TextField
                    fullWidth
                    label="Answer"
                    value={faq.answer}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleFAQChange(index, "answer", e)
                    }
                    required
                    multiline
                    rows={3}
                    variant="outlined"
                  />
                  <Button
                    onClick={() => removeFAQ(index)}
                    variant="contained"
                    color="error"
                    disabled={course.faqs.length === 1}
                    startIcon={<Remove />}
                  >
                    Remove FAQ
                  </Button>
                </Box>
              </Paper>
            ))}
            <Button onClick={addFAQ} variant="outlined" startIcon={<Add />}>
              Add FAQ
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 4, py: 1.5 }}
            disabled={updateCourseMutation.isPending}
          >
            {updateCourseMutation.isPending ? "Submitting..." : "Submit Course"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {error || "Course updated successfully!"}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseEditForm;

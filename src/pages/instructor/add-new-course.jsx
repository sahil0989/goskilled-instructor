import { useEffect } from "react"
import { Button } from "../../@/components/ui/button"
import { Card, CardContent } from "../../@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../@/components/ui/tabs"
import CourseLandingPage from "../../components/courses/add-new-course/course-landing"
import CourseCurriculum from "../../components/courses/add-new-course/CourseCurriculum"
import CourseSetting from "../../components/courses/add-new-course/CourseSetting"
import { useInstructor } from "../../context/instructor-context/InstructorContext"
import { useNavigate, useParams } from "react-router-dom"
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "../../services"
import { courseCurriculumInitialFromData, courseLandingInitialFormData } from "../../config"

function AddNewCourse() {

    const { courseLandingFormData,
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId } = useInstructor()


    const navigate = useNavigate();
    const params = useParams();

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }

        return value === "" || value === null || value === undefined;
    }

    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            if (
                isEmpty(item.title) ||
                isEmpty(item.videoUrl) ||
                isEmpty(item.public_id)
            ) {
                return false;
            }

            if (item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }

        return hasFreePreview;
    }

    async function handleCreateCourse() {
        const courseFinalFormData = {
            instructorName: "GoSkilled",
            date: new Date(),
            ...courseLandingFormData,
            students: [],
            curriculum: courseCurriculumFormData,
            isPublised: true,
        };

        const response =
            currentEditedCourseId !== null
                ? await updateCourseByIdService(
                    currentEditedCourseId,
                    courseFinalFormData
                )
                : await addNewCourseService(courseFinalFormData);

        if (response?.success) {
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFromData);
            navigate(-1);
            setCurrentEditedCourseId(null);
        }

        console.log(courseFinalFormData, "courseFinalFormData");
    }

    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetailsService(
            currentEditedCourseId
        );

        if (response?.success) {
            const setCourseFormData = Object.keys(
                courseLandingInitialFormData
            ).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key];

                return acc;
            }, {});

            console.log(setCourseFormData," response data " ,response?.data, "setCourseFormData");
            setCourseLandingFormData(setCourseFormData);
            setCourseCurriculumFormData(response?.data?.curriculum);
        }

        console.log(response, "response");
    }

    useEffect(() => {
        if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
        // eslint-disable-next-line
    }, [currentEditedCourseId]);

    useEffect(() => {
        if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
        // eslint-disable-next-line
    }, [params?.courseId]);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
                <Button disabled={!validateFormData()}
                    onClick={handleCreateCourse}
                    className='text-sm tracking-wider font-bold px-8'>SUBMIT</Button>
            </div>

            <Card>
                <CardContent>
                    <div className="mx-auto p-4 container">
                        <Tabs defaultValue='curriculum' className=' space-y-4 py-2'>
                            <TabsList className="flex justify-start gap-5 p-8">
                                <TabsTrigger value='curriculum' className='px-5 py-2 rounded-lg'>Curriculum</TabsTrigger>
                                <TabsTrigger value='course-landing-page' className='px-5 py-2 rounded-lg'>Course Landing Page</TabsTrigger>
                                <TabsTrigger value='settings' className='px-5 py-2 rounded-lg'>Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value='curriculum'>
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value='course-landing-page'>
                                <CourseLandingPage />
                            </TabsContent>
                            <TabsContent value='settings'>
                                <CourseSetting />
                            </TabsContent>

                        </Tabs>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}

export default AddNewCourse
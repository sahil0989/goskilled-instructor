import { Delete, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../@/components/ui/card";
import { Button } from "../../@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useInstructor } from "../../context/instructor-context/InstructorContext";
import { courseCurriculumInitialFromData, courseLandingInitialFormData } from "../../config";

function InstructorCourses({ listOfCourses }) {

    const { setCurrentEditedCourseId,
        setCourseLandingFormData,
        setCourseCurriculumFormData } = useInstructor();

    const navigate = useNavigate();

    return (
        <>
            <Card>
                <CardHeader className="flex justify-between flex-row items-center">
                    <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
                    <Button
                        onClick={() => {
                            setCurrentEditedCourseId(null);
                            setCourseLandingFormData(courseLandingInitialFormData);
                            setCourseCurriculumFormData(courseCurriculumInitialFromData);
                            navigate("/create-new-course");
                        }}
                        className="p-6"
                    >
                        Create New Course
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Students</TableHead>
                                    <TableHead>Revenue</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listOfCourses && listOfCourses.length > 0
                                    ? listOfCourses.map((course) => (
                                        <TableRow key={course?._id}>
                                            <TableCell className="font-medium">
                                                {course?.title}
                                            </TableCell>
                                            <TableCell>{course?.students?.length}</TableCell>
                                            <TableCell>
                                                Rs. {course?.students?.length * course?.pricing}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    onClick={() => {
                                                        navigate(`/instructor/edit-course/${course?._id}`);
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                >
                                                    <Edit className="h-6 w-6" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Delete className="h-6 w-6" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : null}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default InstructorCourses;
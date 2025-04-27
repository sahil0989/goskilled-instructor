import React from 'react'
import { useInstructor } from '../../../context/instructor-context/InstructorContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { Switch } from '../../../@/components/ui/switch';
import { Label } from '../../../@/components/ui/label';
import { courseCurriculumInitialFromData } from '../../../config';
import { mediaDeleteService, mediaUploadService } from '../../../services';
import MediaProgressbar from '../../media-progress-bar/media-progress';
import VideoPlayer from '../../video-player/video-player';

function CourseCurriculum() {

    const { mediaUploadProgress, courseCurriculumFormData, setCourseCurriculumFormData, setMediaUploadProgress, mediaUploadProgressPercentage, setMediaUploadProgressPercentage } = useInstructor();

    const handleNewLecture = () => {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFromData[0]
            }
        ])
    }

    const handleCourseTitleChange = (event, currentIndex) => {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData]

        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            title: event.target.value
        }

        setCourseCurriculumFormData(cpyCourseCurriculumFormData)

        console.log(courseCurriculumFormData)
    }

    const handleFreePreviewChange = (value, currentIndex) => {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData]

        cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            freePreview: value
        }

        setCourseCurriculumFormData(cpyCourseCurriculumFormData)
    }

    const handleSingleLectureUpload = async (event, currentIndex) => {
        console.log(event.target.files)

        const selectedFile = event.target.files[0];

        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append("file", selectedFile);

            try {
                setMediaUploadProgress(true)

                const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage)

                if (response.success) {
                    let cpyCourseCurriculumFormData = [...courseCurriculumFormData]

                    cpyCourseCurriculumFormData[currentIndex] = {
                        ...cpyCourseCurriculumFormData[currentIndex],
                        videoUrl: response?.data?.url,
                        public_id: response?.data?.public_id
                    }

                    setCourseCurriculumFormData(cpyCourseCurriculumFormData);

                    setMediaUploadProgress(false)
                }



            } catch (err) {
                console.log(err.message)
            }
        }
    }

    function isCourseCurriculumFormDataValid() {
        return courseCurriculumFormData.every((item) => {
            return (
                item &&
                typeof item === "object" &&
                item.title.trim() !== "" &&
                item.videoUrl.trim() !== ""
            );
        });
    }

    async function handleReplaceVideo(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId =
            cpyCourseCurriculumFormData[currentIndex].public_id;

        console.log(getCurrentVideoPublicId);

        const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId);

        console.log(deleteCurrentMediaResponse);

        if (deleteCurrentMediaResponse?.success) {
            cpyCourseCurriculumFormData[currentIndex] = {
                ...cpyCourseCurriculumFormData[currentIndex],
                videoUrl: "",
                public_id: "",
            };

            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
    }

    async function handleDeleteLecture(currentIndex) {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentSelectedVideoPublicId =
            cpyCourseCurriculumFormData[currentIndex].public_id;

        const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

        if (response?.success) {
            cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
                (_, index) => index !== currentIndex
            );

            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Create Course Curriculum
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress} onClick={handleNewLecture}>Add Lecture</Button>
                {
                    mediaUploadProgress ?
                        <MediaProgressbar
                            isMediaUploading={mediaUploadProgress}
                            progress={mediaUploadProgressPercentage}
                        /> : null
                }
                <div className='mt-4 space-y-4'>

                    {
                        courseCurriculumFormData?.map((curriculumItem, index) => {
                            return <div key={index} className='border p-5 rounded-md'>
                                <div className='flex gap-5 items-center mb-4'>
                                    <h3 className='font-semibold'>Lecture {index + 1}</h3>
                                    <Input
                                        name={`title-${index + 1}`}
                                        type='text'
                                        placeholder='Enter a lecture title'
                                        className="w-96"
                                        onChange={(event) => handleCourseTitleChange(event, index)}
                                        value={courseCurriculumFormData[index]?.title}
                                    />
                                    <div className='flex items-center space-x-2'>
                                        <Switch
                                            onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                                            checked={courseCurriculumFormData[index].freePreview}
                                            id={`freePreview-${index + 1}`}
                                        />
                                        <Label htmlFor={`freePreview-${index + 1}`}>Free Preview</Label>
                                    </div>
                                </div>

                                <Card>

                                    {
                                        courseCurriculumFormData[index]?.videoUrl ?
                                            <div className='flex gap-3'>
                                                <VideoPlayer
                                                    url={courseCurriculumFormData[index]?.videoUrl}
                                                    width="450px"
                                                    height="200px"
                                                />
                                                <Button onClick={() => handleReplaceVideo(index)}>Replace Video</Button>
                                                <Button onClick={() => handleDeleteLecture(index)} className='bg-red-900'>Delete Lecture</Button>
                                            </div> : <Input
                                                type='file'
                                                accept='video/*'
                                                className='mb-4'
                                                onChange={(event) => handleSingleLectureUpload(event, index)}
                                            />
                                    }

                                </Card>

                            </div>
                        })
                    }

                </div>

            </CardContent>
        </Card>
    )
}

export default CourseCurriculum
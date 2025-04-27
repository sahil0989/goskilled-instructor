import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card'
import { Label } from '../../../@/components/ui/label';
import { useInstructor } from '../../../context/instructor-context/InstructorContext';
import { Input } from '../../../@/components/ui/input';
import { mediaPhotoDeleteService, mediaUploadService } from '../../../services';
import MediaProgressbar from '../../media-progress-bar/media-progress';
import { Button } from '../../../@/components/ui/button';

function CourseSetting() {

    const { setMediaUploadProgress, courseLandingFormData, mediaUploadProgress, setCourseLandingFormData, mediaUploadProgressPercentage, setMediaUploadProgressPercentage } = useInstructor()

    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append("file", selectedImage);

            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
                console.log("Cloudinary: ", response)
                if (response.success) {
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image: response?.data?.url,
                        imagePublicId: response?.data?.public_id,
                    });
                    setMediaUploadProgress(false);
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    console.log(courseLandingFormData)

    const fileInputRef = React.useRef(null);

    async function handleReplaceImage() {
        const currentPublicId = courseLandingFormData?.imagePublicId;

        if (currentPublicId) {
            const deleteResponse = await mediaPhotoDeleteService(currentPublicId);
            console.log("Image Delete Response:", deleteResponse);

            if (deleteResponse?.success) {
                setCourseLandingFormData({
                    ...courseLandingFormData,
                    image: "",
                    imagePublicId: "",
                });

                fileInputRef.current?.click();
            }
        } else {
            fileInputRef.current?.click();
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Settings</CardTitle>
            </CardHeader>
            <div className="p-4">
                {mediaUploadProgress ? (
                    <MediaProgressbar
                        isMediaUploading={mediaUploadProgress}
                        progress={mediaUploadProgressPercentage}
                    />
                ) : null}
            </div>
            <CardContent>
                {courseLandingFormData?.image ? (
                    <>
                        <Button className='mb-4' onClick={handleReplaceImage}>Replace Image</Button>
                        <img src={courseLandingFormData.image} alt='' />
                    </>
                ) : (
                    <div className="flex flex-col gap-3">
                        <Label>Upload Course Image</Label>
                        <Input
                            onChange={handleImageUploadChange}
                            type="file"
                            accept="image/*"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default CourseSetting
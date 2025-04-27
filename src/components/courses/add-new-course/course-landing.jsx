import { Button } from "../../../@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../@/components/ui/card"
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Textarea } from "../../../@/components/ui/textarea";
import { useInstructor } from "../../../context/instructor-context/InstructorContext";

function CourseLandingPage() {

    const { courseLandingFormData, setCourseLandingFormData } = useInstructor();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseLandingFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log("Course page: ", courseLandingFormData)


    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title');
        const subtitle = formData.get('subtitle');
        const description = formData.get('description');
        const pricing = formData.get('pricing');
        const objectives = formData.get('objectives')
        const welcomeMessage = formData.get('welcomeMessage');

        setCourseLandingFormData({
            title, subtitle, description, pricing, welcomeMessage, objectives,
            image: courseLandingFormData?.image,
            imagePublicId: courseLandingFormData?.imagePublicId
        })
    }

    const isFormValid = Object.values(courseLandingFormData).every(
        (val) => val !== "" && val !== null && val !== undefined
    );


    return (
        <Card>
            <CardHeader>
                <CardTitle>Course Landing Page</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter a title"
                            type='text'
                            onChange={handleChange}
                            value={courseLandingFormData?.title}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="subtitle">Subtitle</Label>
                        </div>
                        <Input
                            id="subtitle"
                            name="subtitle"
                            type="text"
                            placeholder='Enter a subtitle'
                            onChange={handleChange}
                            value={courseLandingFormData?.subtitle}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description">Description</Label>
                        </div>
                        <Textarea
                            id="description"
                            name="description"
                            type="text"
                            onChange={handleChange}
                            value={courseLandingFormData?.description}
                            placeholder='Enter a description'
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="price">Price</Label>
                        </div>
                        <Input
                            id="pricing"
                            name="pricing"
                            type="number"
                            placeholder='Enter a price'
                            onChange={handleChange}
                            value={courseLandingFormData?.pricing}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="objective">Objective</Label>
                        </div>
                        <Textarea
                            id="objectives"
                            name="objectives"
                            type="text"
                            onChange={handleChange}
                            value={courseLandingFormData?.objectives}
                            placeholder='Enter a objective'
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="welcomeMessage">Welcome Message</Label>
                        </div>
                        <Textarea
                            id="welcomeMessage"
                            name="welcomeMessage"
                            type="text"
                            onChange={handleChange}
                            value={courseLandingFormData?.welcomeMessage}
                            placeholder='Enter a welcome message'
                            required
                        />
                    </div>

                    <Button disabled={!isFormValid} type="submit" className="w-full">
                        submit
                    </Button>

                </form>
            </CardContent>
        </Card>
    )
}

export default CourseLandingPage
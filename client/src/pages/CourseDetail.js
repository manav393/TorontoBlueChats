import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from 'react-bootstrap/Card'
import Sections from '../components/Sections'
import NewChatModal from '../components/NewChatModal'
import Alert from 'react-bootstrap/Alert'

const CourseDetail = (props) => {
    const params = useParams()
    const [course, setCourse] = useState('COURSE NOT FOUND')
    const { code } = params
    const sections_list = course === 'COURSE NOT FOUND' ? [] : ['Common', ...course.lectures]
    const groupchats = course === 'COURSE NOT FOUND' ? [] : [...course.Groupchats]

    const [showNewForm, setShowNewForm] = useState(false);

    const handleNewFormClose = () => setShowNewForm(false);
    const handleNewFormShow = () => {
        setShowAlert(false)
        setShowNewForm(true)
    };

    const [showAlert, setShowAlert] = useState(false)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        const fetchData = async (code) => {
            const response = await fetch(`/api/courses/${code}`)
            const data = await response.json()
            setCourse(data)
        }

        fetchData(code)
    }, [code, showAlert])

    const form_options = sections_list.map((lec) => <option key={lec}>{lec}</option>)

    if (course === 'y') {
        return <h2>'COURSE NOT FOUND'</h2>
    }

    return (
        <>
            {showAlert && <Alert variant="WhatsApp" onClose={() => setShowAlert(false)} dismissible>
                <Alert.Heading>Woohoo! Groupchat Made</Alert.Heading>
            </Alert>}

            {showError && <Alert variant="secondary-red" onClose={() => setShowError(false)} dismissible>
                <Alert.Heading>Oh no! Looks like there was a problem making your groupchat.</Alert.Heading>
            </Alert>}

            <NewChatModal
                showNewForm={showNewForm}
                handleNewFormClose={handleNewFormClose}
                form_options={form_options}
                courseId={course.id}
                setShowAlert={setShowAlert}
                setShowError={setShowError}
            />
            <Card className="p-2 align-items-center rounded" bg="secondary-blue" text="white">
                <h1 className="display-3 fw-bold">{course.code}</h1>
                <h2 className="display-6">{course.title}</h2>
            </Card>
            <Sections lectures={sections_list} groupchats={groupchats} handleNewFormShow={handleNewFormShow} />
        </>
    )
}

export default CourseDetail
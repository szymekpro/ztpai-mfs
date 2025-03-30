import Sidebar from "../components/navigation/Sidebar.tsx";


export default function HomePage() {

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flexGrow: 1, padding: '1rem' }}>
                    gyms
                </main>
            </div>
        </>
    )
}

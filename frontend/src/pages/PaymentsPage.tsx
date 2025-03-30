import Sidebar from "../components/navigation/Sidebar.tsx";


export default function PaymentsPage() {

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flexGrow: 1, padding: '1rem' }}>
                    payments
                </main>
            </div>
        </>
    )
}

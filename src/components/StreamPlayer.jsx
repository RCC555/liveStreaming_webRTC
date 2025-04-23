function StreamPlayer({ onLogout }) {
  return (
    <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-3">
      <button
        onClick={onLogout}
        className="btn btn-danger mb-3"
      >
        Logout
      </button>
      <div className="card shadow w-100" style={{ maxWidth: '896px' }}>
        <iframe
          src= "https://neutral-plainly-badger.ngrok-free.app" // Replace with your ngrok URL
          className="w-100"
          style={{ height: '60vh' }}
          title="Live Stream"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default StreamPlayer;

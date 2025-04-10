export default function AgentNotFound() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent Not Found</h1>
          <p className="mt-2 text-gray-600">
            The agent you're looking for doesn't exist or you don't have access.
          </p>
        </div>
      </div>
    );
  }
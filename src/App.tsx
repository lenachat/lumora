import MainView from './components/main-view/main-view.tsx';
function App() {
  return (
    <div className="relative bg-background min-h-screen">
      <div className="absolute inset-0 bg-[url('./../files/grain.jpg')] bg-cover bg-center opacity-10" />
      <div className="relative z-10">
        <MainView />
      </div>
    </div>

  );
};

export default App;

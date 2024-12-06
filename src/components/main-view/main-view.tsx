import { Button } from "@/components/ui/button";

const MainView = () => {
  return (
    <div className='bg-indigo-50 py-5 px-10'>
      <h1>Yournal</h1>
      <p>Yournal is a journaling app that allows you to write, save, and delete journal entries.
        It is a simple and easy-to-use app that is perfect for anyone who wants to keep a journal.
      </p>
      <Button className="bg-purple-400">Get Started</Button>
    </div>
  );

};

export default MainView;

import Header from '../components/Header';
import AlreadyVotedCard from '../components/AlreadyVotedCard';

const Home = () => (
  <>
    <Header />
    <AlreadyVotedCard />
  </>
)

Home.getInitialProps = () => ({
  namespacesRequired: ['MessageCard']
});

export default Home;

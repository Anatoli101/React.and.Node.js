  window.ee = new EventEmitter();  //adding a library to generate an event 

  var my_news = [
      {
          author: 'Andrzej Duda',
          text: 'Zrobimy wszystkie dni wolne od pracy',
          bigText: 'Ludzi musza odpoczywac'
        },
        {
          author: 'Chlopak z ulicy',
          text: 'Jade na baluty kupic proszek do prania',
          bigText: 'Ostatnio za malo proszku dali'
        },
        {
          author: 'Gosc z Ukrainy',
          text: 'Ja bede twoim rabem a ty mnie groszy bedziesz placil',
          bigText: 'Ale potem przyjade na Ukraine i bede piw wodke everyday'
        },
    ];

    var News = React.createClass({
        propTypes:{
          data:React.PropTypes.array.isRequired
        },

        getInitialState: function(){
          return{
            counter: 0
          }
        },
        onTotalNewsClick: function(){
          this.setState({counter: ++this.state.counter});
        },

      render: function() {
        var data = this.props.data;
        var newsTemplate;

        if (data.length > 0){
        newsTemplate = data.map(function(item, index) {
          return (
              <div key={index}>
              <Article data={item} />
            </div>
          )
        })
      }else{
            newsTemplate = <p>К сожалению Новостей нет.</p>
        }
        return (
          <div className="news">
            {newsTemplate}
            <strong 
             className={'news__count ' + (data.length > 0 ? '':'none') }
             onClick={this.onTotalNewsClick}>
             Всего новостей: {data.length}
             </strong>
          </div>
        );
      }
    });

    var Article = React.createClass({
      propTypes: {
          data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
          })
        },
        getInitialState: function(){
            return { 
              visible:false
            }
        },

        readmoreClick: function(e) {
          e.preventDefault();
          this.setState({visible:true});
        },


        render: function() {
          var author = this.props.data.author,
              text = this.props.data.text,
              bigText = this.props.data.bigText,
              visible = this.state.visible;
          


      return (
        <div className="article">
          <p className="news__author">{author}:</p>
          <p className="news__text">{text}</p>
          <a href="#" onClick={this.readmoreClick} 
                      className={"news_readmore "}>
                      Details</a>
          <p className={'new__bigText ' + (visible ? '' : 'none')}>{bigText}</p>
        </div>
      )
    }
  });

  
  var Add = React.createClass({
    getInitialState:function(){
      return {
      agreeNotChecked:true,
      authorIsEmpty:true,
      textIsEmpty:true
      }
    },
    componentDidMount: function() {
      ReactDOM.findDOMNode(this.refs.author).focus();
    },
    
    onBtnClickHandler: function(e) {
      e.preventDefault();
      var author = ReactDOM.findDOMNode(this.refs.author).value;
      var textEl = ReactDOM.findDOMNode(this.refs.text);

      var text = textEl.value;
      var item  = [{
        author:author,
        text:text,
        bigText:'...'
      }];
      window.ee.emit('News.add', item);

      textEl.value = '';
      this.setState({textIsEmpty:true});
    },

    onCheckRuleClick: function(e) {
      this.setState({agreeNotChecked: !this.state.agreeNotChecked}); 
    },
    
    onFieldChange:function(fieldName,e){
      if(e.target.value.trim().length > 0){
        this.setState({['' +fieldName]:false})
      }else{
        this.setState({['' +fieldName]:true})
      }
    },
    render: function() {
      var agreeNotChecked = this.state.agreeNotChecked,
          authorIsEmpty = this.state.authorIsEmpty,
          textIsEmpty = this.state.textIsEmpty;

      return (
        <form className='add cf'>
          <input
            type='text'
            className='add__author'
            defaultValue=''
            placeholder='Your name'
            ref='author'
           onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
          />
          <textarea
            className='add__text'
            defaultValue=''
            placeholder='Text of your news'
            ref='text'
            onChange={this.onFieldChange.bind(this,'textIsEmpty')}
          ></textarea>
          <label className='add__checkrule'>
            <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>I agree with terms
          </label>

          <button
            className='add__btn'
            onClick={this.onBtnClickHandler}
            ref='alert_button'
            disabled={agreeNotChecked || authorIsEmpty || textIsEmpty }
            >
            Add
          </button>

        </form>
      );
    }
  });


  var App = React.createClass({
    getInitialState: function(){
      return{
        news:my_news
      }
    },

    componentDidMount: function(){
      var self = this;
      window.ee.addListener('News.add', function(item){
        var nextNews = item.concat(self.state.news);
        self.setState({news: nextNews});
      })
    },
    componentWillMount:function() {
      window.ee.removeListener('News.add');
    },

      render: function(){
          return(
              console.log('render'),
              <div className = "app"><div className="firstBlock">
                <h3>Add News</h3>
                <Add />
                </div><div className="newsBlock">
                <h3>Last News</h3>
                <News data={this.state.news}/>
                </div>
              </div>
              
          );
      }
  });





ReactDOM.render(
    <App />,
    document.getElementById('root')
)


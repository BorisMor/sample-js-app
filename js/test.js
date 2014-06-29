var appTest = function (options) {
    var self = this;

    // jQuery элемент к которому привязываем все собятия
    var elem = undefined;
    // текущий вопрос
    this.question_cur = 0;
    // Максимум вопросов
    this.question_max = undefined;

    // Настройки по умолчанию
    this.option = {
        // отладка
        bebug: false,
        // селект для this.elem
        elem: '#out',
        // данные из вне
        data: []
    }

    // Подбираем параметры
    $.extend(this.option, options);

    /**
     * Вызывается после загрузки страницы
     * Служит для инициализации
     */
    this.PageLoad = function()
    {
        elem = $(self.option.elem);
        this.question_cur = 0;
        this.question_max = self.option.data.length - 1;

        // --- подвязывваем DOM события тригер
        elem.on('click', '.prev_question', {event: 'question:prev'}, callTrigger);
        elem.on('click', '.next_question', {event: 'question:next'}, callTrigger);

        // --- подвязываем события
        elem.on('question:prev', eventQuestionPrev);
        elem.on('question:next', eventQuestionNext);
    }

    /**
     * Логирование.
     * Зависит от включенного "option.bebug"
     */
    this.log = function(){
        if(!this.option.bebug) return;

        var args = Array.prototype.slice.call(arguments);

        try {
            console.log.apply(console, args);
        } catch (e) {
            console.log(args.join(' '));
        }
    }

    /**
     * Вызвать тригер на событие
     * e.data.event - Название тригера
     * @param e event
     */
    function callTrigger(e) {
        e.preventDefault();
        var params = {
            type: e.data.event,
            target: e.target,
            context: this
        };

        self.log(params);
        elem.trigger(params);
    }

    /**
     * Отрисовка вопроса
     */
    this.render = function()
    {
        this.renderQuestion();
        this.renderPage()
    }

    /**
     * Выводим текущий вопрос
     */
    this.renderQuestion = function()
    {
        this.log(this.option.data);
        var item = this.option.data[this.question_cur];         // текущий вопрос
        var tmplItem = _.template($('#temlate-test').html());   // вызываем шаблонизатор
        $('.show',elem).html(tmplItem(item));                   // выводим
    }

    /**
     * Выводим нумератор страниц
     */
    this.renderPage = function()
    {
        var $page = $('.page',elem);
        $('.prev_question', $page).prop( "disabled", this.question_cur == 0 );
        $('.next_question', $page).prop( "disabled", this.question_cur == this.question_max );
    }

    function sevaCurSelect()
    {
        var item = self.option.data[self.question_cur];
        item.select = $('input:checked').val();
    }

    /**
     * Предыдущий вопрос
     * @param e
     */
    function eventQuestionPrev(e)
    {
        if(self.question_cur > 0){
            sevaCurSelect();
            self.question_cur--;
            self.render();
        }
    }

    /**
     * Следующий вопрос
     * @param e
     */
    function eventQuestionNext(e)
    {
        if(self.question_cur < self.question_max){
            sevaCurSelect();
            self.question_cur++;
            self.render();
        }
    }
}

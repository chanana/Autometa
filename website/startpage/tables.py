import itertools
import django_tables2 as tables
from .models import Uploads


class UploadsTable(tables.Table):
    row_number = tables.Column(empty_values=(), verbose_name="#")
    download = tables.TemplateColumn(
        verbose_name="Download",
        template_code='''<a href="{{ record.file.url }}" class="btn btn-primary btn-sm" target="_blank">Download</a>'''
    )
    visualize = tables.TemplateColumn(
        verbose_name="View",
        template_code='''<a href="{% url 'visualize-table' record.pk %}" class="btn btn-primary btn-sm">View</a>'''
    )
    delete = tables.TemplateColumn(
        verbose_name="Delete",
        template_code='''<a class="btn btn-danger btn-sm mt-1 mb-1" href="{% url 'uploads-delete' object.id %}">Delete</a>'''
    )
    # delete_file_button = tables.TemplateColumn(
    #     verbose_name="Delete",
    #     template_code='< form method="post" action="{% url \'delete_file\' file.pk %}" >{ % csrf_token % } < button type="submit" class="btn btn-danger btn-sm" > Delete < /button >< / form >')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.counter = itertools.count(1)

    def render_row_number(self):
        return "%d" % next(self.counter)

    class Meta:
        model = Uploads
        # template_name = "django_tables2/bootstrap.html"
        exclude = ("user", "id", "file")

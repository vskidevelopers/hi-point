// src/components/pdf/RepairQuoteDocument.tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { ServiceTicket, TicketUpdate } from '@/types'
import { DISPLAY_PHONE, LOCATION } from '@/lib/constants'

interface RepairQuoteDocumentProps {
    ticket: ServiceTicket & { ticket_updates: TicketUpdate[] }
    companyName?: string
}

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        color: '#1f2937',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottom: '2 solid #0ea5e9',
    },
    companySection: {
        flex: 1,
    },
    companyName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: 4,
    },
    tagline: {
        fontSize: 10,
        color: '#6b7280',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    contactInfo: {
        fontSize: 9,
        color: '#4b5563',
        lineHeight: 1.5,
    },
    quoteSection: {
        textAlign: 'right',
    },
    quoteTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    quoteNumber: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 2,
    },
    quoteDate: {
        fontSize: 10,
        color: '#6b7280',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0ea5e9',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 20,
    },
    infoColumn: {
        flex: 1,
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 4,
    },
    infoLabel: {
        fontSize: 9,
        color: '#6b7280',
        textTransform: 'uppercase',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 11,
        color: '#1f2937',
        marginBottom: 6,
        fontWeight: 'bold',
    },
    issueBox: {
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 4,
        borderLeft: '3 solid #0ea5e9',
    },
    issueText: {
        fontSize: 10,
        lineHeight: 1.5,
        color: '#374151',
    },
    pricingTable: {
        marginTop: 10,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottom: '1 solid #e5e7eb',
    },
    pricingLabel: {
        fontSize: 11,
        color: '#4b5563',
    },
    pricingValue: {
        fontSize: 11,
        color: '#1f2937',
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        backgroundColor: '#0ea5e9',
        marginTop: 8,
        borderRadius: 4,
        paddingHorizontal: 12,
    },
    totalLabel: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 13,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    timelineSection: {
        marginTop: 20,
    },
    timelineItem: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingLeft: 10,
        borderLeft: '2 solid #e5e7eb',
    },
    timelineDate: {
        fontSize: 9,
        color: '#6b7280',
        width: 100,
    },
    timelineStatus: {
        fontSize: 10,
        color: '#1f2937',
        flex: 1,
        textTransform: 'capitalize',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: '1 solid #e5e7eb',
        paddingTop: 12,
    },
    footerText: {
        fontSize: 9,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 1.5,
    },
    termsBox: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#fffbeb',
        border: '1 solid #fde68a',
        borderRadius: 4,
    },
    termsTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#92400e',
        marginBottom: 4,
    },
    termsText: {
        fontSize: 9,
        color: '#78350f',
        lineHeight: 1.5,
    },
})

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

function formatCurrency(amount: number) {
    return `KES ${amount.toLocaleString()}`
}

function formatStatus(status: string) {
    return status.replace(/_/g, ' ').toLowerCase()
}

export function RepairQuoteDocument({ ticket, companyName = 'High Point Technologies' }: RepairQuoteDocumentProps) {
    const hasConsultationFee = ticket.consultation_fee && ticket.consultation_fee > 0
    const hasRepairQuote = ticket.repair_quote && ticket.repair_quote > 0
    const total = (ticket.consultation_fee || 0) + (ticket.repair_quote || 0)

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.companySection}>
                        <Text style={styles.companyName}>{companyName}</Text>
                        <Text style={styles.tagline}>Precision. Performance. Reliability.</Text>
                        <View style={styles.contactInfo}>
                            <Text>{LOCATION.address}</Text>
                            <Text>Tel: {DISPLAY_PHONE}</Text>
                            <Text>info@highpointtech.co.ke</Text>
                        </View>
                    </View>
                    <View style={styles.quoteSection}>
                        <Text style={styles.quoteTitle}>REPAIR QUOTE</Text>
                        <Text style={styles.quoteNumber}>#{ticket.ticket_number}</Text>
                        <Text style={styles.quoteDate}>Issued: {formatDate(ticket.created_at)}</Text>
                    </View>
                </View>

                {/* Customer & Device Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Service Details</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Customer</Text>
                            <Text style={styles.infoValue}>{ticket.customer_name}</Text>
                            <Text style={styles.infoLabel}>Phone</Text>
                            <Text style={styles.infoValue}>{ticket.customer_phone}</Text>
                            {ticket.customer_email && (
                                <>
                                    <Text style={styles.infoLabel}>Email</Text>
                                    <Text style={styles.infoValue}>{ticket.customer_email}</Text>
                                </>
                            )}
                        </View>
                        <View style={styles.infoColumn}>
                            <Text style={styles.infoLabel}>Device Brand</Text>
                            <Text style={styles.infoValue}>{ticket.device_brand}</Text>
                            <Text style={styles.infoLabel}>Device Model</Text>
                            <Text style={styles.infoValue}>{ticket.device_model}</Text>
                            <Text style={styles.infoLabel}>Current Status</Text>
                            <Text style={styles.infoValue}>{formatStatus(ticket.status)}</Text>
                        </View>
                    </View>
                </View>

                {/* Issue Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reported Issue</Text>
                    <View style={styles.issueBox}>
                        <Text style={styles.issueText}>{ticket.issue_description}</Text>
                    </View>
                </View>

                {/* Pricing Breakdown */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quote Breakdown</Text>
                    <View style={styles.pricingTable}>
                        {hasConsultationFee && (
                            <View style={styles.pricingRow}>
                                <Text style={styles.pricingLabel}>Consultation / Diagnostic Fee</Text>
                                <Text style={styles.pricingValue}>{formatCurrency(ticket.consultation_fee || 0)}</Text>
                            </View>
                        )}
                        {hasRepairQuote && (
                            <View style={styles.pricingRow}>
                                <Text style={styles.pricingLabel}>Repair Service & Parts</Text>
                                <Text style={styles.pricingValue}>{formatCurrency(ticket.repair_quote || 0)}</Text>
                            </View>
                        )}
                        {!hasConsultationFee && !hasRepairQuote && (
                            <View style={styles.pricingRow}>
                                <Text style={styles.pricingLabel}>Quote pending - awaiting full diagnosis</Text>
                                <Text style={styles.pricingValue}>TBD</Text>
                            </View>
                        )}
                    </View>
                    {(hasConsultationFee || hasRepairQuote) && (
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL ESTIMATE</Text>
                            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
                        </View>
                    )}
                </View>

                {/* Status Timeline */}
                {ticket.ticket_updates.length > 0 && (
                    <View style={styles.timelineSection}>
                        <Text style={styles.sectionTitle}>Service Timeline</Text>
                        {ticket.ticket_updates.map((update, index) => (
                            <View key={update.id || index} style={styles.timelineItem}>
                                <Text style={styles.timelineDate}>{formatDate(update.created_at)}</Text>
                                <Text style={styles.timelineStatus}>{formatStatus(update.new_status)}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Terms */}
                <View style={styles.termsBox}>
                    <Text style={styles.termsTitle}>Terms & Conditions</Text>
                    <Text style={styles.termsText}>
                        • This quote is valid for 14 days from the date of issue.{'\n'}
                        • Consultation fee is non-refundable once diagnostics are completed.{'\n'}
                        • Repairs will only commence upon customer approval and payment of the quoted amount.{'\n'}
                        • All repairs come with a 30-day service warranty on workmanship.{'\n'}
                        • For inquiries, contact us at {DISPLAY_PHONE} or visit our shop at {LOCATION.address}.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Thank you for choosing {companyName}. We appreciate your business.{'\n'}
                        This is a computer-generated quote. For questions, please contact us.
                    </Text>
                </View>
            </Page>
        </Document>
    )
}